// src/pages/Stats.jsx
import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/components/stats/_statsPage.scss";

/* Navegación global */
import TopBar from "../components/common/TopBar";
import SideRail from "../components/common/SideRail";

/* UI Stats */
import StatsHeader from "../components/stats/StatsHeader";
import ChartShell from "../components/stats/ChartShell";
import StatsToggle from "../components/stats/StatsToggle";
import YearPicker from "../components/stats/YearPicker";
import CountryPicker from "../components/stats/CountryPicker";
import EventList from "../components/stats/EventList";
import StatsBarChart from "../components/stats/StatsBarChart";

/* Data hooks (genéricos por categoría EONET) */
import { useWildfiresByYear } from "../hooks/useWildfiresByYear";
import { useWildfiresByCountry } from "../hooks/useWildfiresByCountry";

/* Config de desastres */
import { resolveDisaster } from "../app/constants";

/* ---------- Config base ---------- */

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - i);

const FALLBACK_COUNTRIES = [
  "Africa",
  "México",
  "EUA",
  "Zambia",
  "Angola",
  "Chile",
  "Rusia",
  "India",
  "Japón",
  "Canadá",
];

// categorías que NO tienen datos en EONET y se llenan con mocks
const MOCK_DISASTERS = new Set(["earthquakes", "dust-haze"]);

/* ==========================================
   Componente principal
   ========================================== */
export default function StatsPage() {
  // Ruta: /stats/:disasterKey
  const { disasterKey } = useParams();

  // Desastre activo (title, theme, slug de EONET, units, etc.)
  const disaster = useMemo(() => resolveDisaster(disasterKey), [disasterKey]);

  const categoryId = disaster.eonetCategorySlug || disaster.key || "wildfires";
  const theme = disaster.theme || "wildfires";
  const isMockCategory = MOCK_DISASTERS.has(disaster.key);

  const [mode, setMode] = useState("year"); // "year" | "country"
  const [year, setYear] = useState(YEARS[0]);
  const [country, setCountry] = useState(FALLBACK_COUNTRIES[0]);
  const [activeKey, setActiveKey] = useState(null); // sync de barra/tabla/picker

  /* --------- Data desde hooks (API) --------- */

  const {
    data: yearSeriesApi,
    isLoading: loadingYearApi,
    isError: errorYearApi,
  } = useWildfiresByYear({ year, categoryId });

  const {
    data: countrySeriesApi,
    isLoading: loadingCountryApi,
    isError: errorCountryApi,
  } = useWildfiresByCountry({ year, categoryId });

  /* --------- Data final (API + mocks) --------- */

  const yearSeries = useMemo(() => {
    if (!isMockCategory) return yearSeriesApi;
    return buildMockYearSeries(disaster.key, year);
  }, [isMockCategory, disaster.key, year, yearSeriesApi]);

  const countrySeries = useMemo(() => {
    if (!isMockCategory) return countrySeriesApi;
    return buildMockRegionSeries(disaster.key);
  }, [isMockCategory, disaster.key, countrySeriesApi]);

  /* --------- Derivados de data --------- */

  // Países/regiones para el CountryPicker
  const countries = useMemo(() => {
    const list = uniqueNames(countrySeries);
    return list.length ? list : FALLBACK_COUNTRIES;
  }, [countrySeries]);

  // Items para EventList (ranking)
  const eventItems = useMemo(
    () => toEventItems(countrySeries, 30),
    [countrySeries]
  );

  // Total “WORLD”
  const worldTotal = useMemo(
    () => sumValues(countrySeries),
    [countrySeries]
  );

  const topRegion = eventItems[0]?.label ?? "—";
  const busiestMonth = getBusiestName(yearSeries);

  // ¿Qué se dibuja en la gráfica?
  const isYearMode = mode === "year";
  const chartLoading = isMockCategory
    ? false
    : isYearMode
      ? loadingYearApi
      : loadingCountryApi;

  const chartError = isMockCategory
    ? false
    : isYearMode
      ? errorYearApi
      : errorCountryApi;

  // Normalizamos la forma esperada por StatsBarChart:
  // xKey="name", yKey="value"
  const chartData = useMemo(() => {
    const source = isYearMode ? yearSeries : countrySeries;
    if (!Array.isArray(source)) return [];

    if (source.length && "name" in source[0] && "value" in source[0])
      return source;

    return source.map((r, i) => ({
      name: r.label ?? r.month ?? r.name ?? String(i + 1),
      value: Number(r.value ?? r.count ?? r.total ?? 0),
    }));
  }, [isYearMode, yearSeries, countrySeries]);

  /* --------- Sincronías y UX --------- */

  // Reset del “activo” al cambiar modo, año o tipo de desastre
  useEffect(() => {
    setActiveKey(null);
  }, [mode, year, disaster.key]);

  // Si cambiamos país desde picker, reflejarlo en ranking activo
  useEffect(() => {
    if (!country) return;
    const match = eventItems.find(
      (it) => it.label === country || it.key === country
    );
    setActiveKey(match ? match.key ?? match.label : null);
  }, [country, eventItems]);

  // Click en barras: solo tiene sentido en modo COUNTRY
  const handleBarClick = (row) => {
    if (!row || isYearMode) return;
    setActiveKey(row.name);
    setCountry(row.name);
    setMode("country");
  };

  /* --------- Vacíos / Errores --------- */

  const emptyChart = !chartLoading && !chartError && chartData.length === 0;
  const subtitle = isYearMode ? `Year ${year}` : country || "—";

  // Unidades según desastre y modo
  const unit =
    mode === "year"
      ? disaster.unitYear || "events"
      : disaster.unitCountry || "events";

  /* ==========================================
     Render — layout tipo dashboard
     ========================================== */
  return (
    <main className={`stats-page stats-page--${theme}`}>
      {/* Navegación global como en Home */}
      <TopBar />


      <div className="stats-page__inner">
        {/* HEADER */}
        <header className="stats-page__header">
          <StatsHeader
            title={disaster.label || disaster.title || "DISASTER"}
            subtitle={subtitle}
          />
        </header>

        {/* KPIs SUPERIORES */}
        <section className="stats-page__kpis">
          <KpiCard
            label="Total events"
            value={worldTotal}
            hint={`All ${disaster.title?.toLowerCase() || "events"} in ${
              isYearMode ? year : `${year} (${country})`
            }`}
          />
          <KpiCard
            label="Busiest month"
            value={busiestMonth}
            hint="Month with highest recorded activity"
          />
          <KpiCard
            label="Top region"
            value={topRegion}
            hint="Region with more events in this year"
          />
        </section>

        {/* CONTROLES */}
        <section className="stats-page__controls">
          <StatsToggle mode={mode} onChange={setMode} />
          <div className="stats-page__picker">
            {isYearMode ? (
              <YearPicker
                years={YEARS}
                selectedYear={year}
                onSelect={setYear}
              />
            ) : (
              <CountryPicker
                countries={countries}
                selected={country}
                onSelect={(c) => {
                  setCountry(c);
                  const match = eventItems.find(
                    (it) => it.label === c || it.key === c
                  );
                  setActiveKey(match ? match.key ?? match.label : null);
                }}
              />
            )}
          </div>
        </section>

        {/* CUERPO PRINCIPAL */}
        <section className="stats-page__body">
          {/* Gráfica principal */}
          <div className="stats-page__chart card">
            <ChartShell height="clamp(300px, 40vh, 430px)">
              <StatsBarChart
                className="stats-barchart"
                data={chartData}
                xKey="name"
                yKey="value"
                unit={unit}
                loading={chartLoading}
                error={chartError}
                empty={emptyChart}
                onBarClick={handleBarClick}
              />
            </ChartShell>
          </div>

          {/* Panel lateral: ranking por región */}
          <aside className="stats-page__side card">
            <EventList
              title="WORLD"
              total={worldTotal}
              items={eventItems}
              activeKey={activeKey}
              onSelect={(it) => {
                setActiveKey(it.key ?? it.label);
                setCountry(it.label);
                setMode("country");
              }}
            />
          </aside>
        </section>
      </div>
    </main>
  );
}

/* =========================
   Helpers
   ========================= */

function toEventItems(series = [], topN = 30) {
  if (!Array.isArray(series)) return [];
  return series
    .map((row, idx) => ({
      key: row.key ?? row.code ?? row.name ?? String(idx),
      label: String(
        row.label ?? row.name ?? row.country ?? `Item ${idx + 1}`
      ),
      value: Number(row.value ?? row.count ?? row.total ?? 0),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
}

function sumValues(series = []) {
  if (!Array.isArray(series)) return 0;
  return series.reduce(
    (acc, r) => acc + Number(r?.value ?? r?.count ?? 0),
    0
  );
}

function uniqueNames(series = []) {
  if (!Array.isArray(series)) return [];
  const set = new Set(
    series
      .map((r) =>
        String(r?.name ?? r?.label ?? r?.country ?? "").trim()
      )
      .filter(Boolean)
  );
  return Array.from(set);
}

/**
 * Devuelve el nombre del bucket con más valor (mes más activo, etc.).
 * Si todos los valores son 0 → "—".
 */
function getBusiestName(series = []) {
  if (!Array.isArray(series) || !series.length) return "—";

  let best = null;
  for (const item of series) {
    const v = Number(item.value ?? 0);
    if (!best || v > best.value) {
      best = { ...item, value: v };
    }
  }

  if (!best || best.value <= 0) return "—";
  return String(best.name ?? best.label ?? "—");
}

/**
 * KPI compacto (card)
 */
function KpiCard({ label, value, hint }) {
  return (
    <article className="kpi-card card">
      <h3 className="kpi-card__label">{label}</h3>
      <p className="kpi-card__value">
        {typeof value === "number"
          ? value.toLocaleString()
          : value || "—"}
      </p>
      {hint && <p className="kpi-card__hint">{hint}</p>}
    </article>
  );
}

/* =========================
   MOCKS para earthquakes / dust-haze
   ========================= */

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildMockYearSeries(kind, year) {
  const baseEq = [4, 5, 6, 9, 12, 14, 13, 11, 8, 7, 5, 4];
  const baseDust = [2, 3, 4, 6, 9, 12, 16, 15, 11, 7, 4, 3];

  const base = kind === "earthquakes" ? baseEq : baseDust;
  const yearOffset = Math.max(0, CURRENT_YEAR - year);
  const factor = 1 + yearOffset * 0.03; // años más viejos → poquitito menos

  return MONTH_LABELS.map((name, idx) => ({
    name,
    value: Math.round(base[idx] * factor),
  }));
}

function buildMockRegionSeries(kind) {
  if (kind === "earthquakes") {
    return [
      { name: "Ring of Fire", label: "Ring of Fire", value: 180 },
      { name: "Mediterranean", label: "Mediterranean", value: 65 },
      { name: "Asia", label: "Asia", value: 120 },
      { name: "South America", label: "South America", value: 52 },
      { name: "Other", label: "Other", value: 24 },
    ];
  }

  // dust-haze
  return [
    { name: "Sahara", label: "Sahara", value: 190 },
    { name: "Middle East", label: "Middle East", value: 110 },
    { name: "Asia", label: "Asia", value: 95 },
    { name: "North America", label: "North America", value: 40 },
    { name: "Other", label: "Other", value: 18 },
  ];
}
