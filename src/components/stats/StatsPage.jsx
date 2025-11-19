// pages/Stats.jsx (o StatsPage.jsx)
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

import StatsScene from "../components/stats/StatsScene";
import StatsHeader from "../components/stats/StatsHeader";
import StatsToggle from "../components/stats/StatsToggle";
import StatsBarChart from "../components/stats/StatsBarChart";
import ChartShell from "../components/stats/ChartShell";
import EventList from "../components/stats/EventList";
import YearPicker from "../components/stats/YearPicker";
import CountryPicker from "../components/stats/CountryPicker";

import { resolveStatsTheme } from "../components/stats/statsThemes";
// (de momento seguimos usando los hooks de wildfires)
import useWildfiresByYear from "../hooks/useWildfiresByYear";
import useWildfiresByCountry from "../hooks/useWildfiresByCountry";

export default function StatsPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState("year"); // "year" | "country"

  const themeKey = searchParams.get("theme") || "wildfires";
  const theme = resolveStatsTheme(themeKey);

  // Datos: por ahora siguen siendo wildfires,
  // pero la UI ya es dinámica según el tema.
  const {
    data: dataByYear = [],
    loading: loadingYear,
    selectedYear,
    onYearChange,
  } = useWildfiresByYear();

  const {
    data: dataByCountry = [],
    loading: loadingCountry,
    selectedCountry,
    onCountryChange,
  } = useWildfiresByCountry();

  const chartData = mode === "year" ? dataByYear : dataByCountry;
  const chartUnit =
    mode === "year" ? theme.unitYear : theme.unitCountry;
  const chartXKey = mode === "year" ? "year" : "country";
  const chartYKey = "count"; // o el que uses en tus adaptadores
  const chartLoading = mode === "year" ? loadingYear : loadingCountry;

  return (
    <StatsScene
      theme={theme.key}
      mode={mode}
      header={
        <StatsHeader
          title={theme.title}
          subtitle={theme.subtitle}
          onInfo={() => console.log("info", theme)}
          onAdd={() => console.log("add custom filter")}
          onChart={() => console.log("open full chart")}
        />
      }
      chart={
        <ChartShell
          title={mode === "year" ? "Eventos por año" : "Eventos por país"}
          subtitle={mode === "year" ? "Tiempo" : "Distribución geográfica"}
        >
          <StatsBarChart
            data={chartData}
            xKey={chartXKey}
            yKey={chartYKey}
            unit={chartUnit}
            loading={chartLoading}
            onBarClick={(item) => {
              console.log("bar clicked", item);
              // aquí puedes disparar un filtro extra o centrar mapa
            }}
          />
        </ChartShell>
      }
      toggleBar={<StatsToggle mode={mode} onChange={setMode} />}
      centerPicker={
        mode === "year" ? (
          <YearPicker value={selectedYear} onChange={onYearChange} />
        ) : (
          <CountryPicker
            value={selectedCountry}
            onChange={onCountryChange}
          />
        )
      }
      worldPanel={
        <EventList
          // aquí pasarías los eventos filtrados según year/country
          // y también el theme si quieres variar el copy
          theme={theme.key}
          mode={mode}
        />
      }
    />
  );
}
