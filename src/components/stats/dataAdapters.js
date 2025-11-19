// src/components/stats/dataAdapters.js

// Si ya tienes otras funciones aquí (adaptYearSeries, adaptCountrySeries, etc.),
// déjalas. Solo AÑADE lo siguiente:

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * A partir de eventos de EONET (adapter de getEventsByCategory),
 * agrupa por mes del año.
 *
 * Espera eventos con:
 *  - date: ISO string
 *
 * Devuelve [{ name: "Jan", value: 10 }, ...]
 */
export function groupEventsByMonth(events = []) {
  const counts = new Array(12).fill(0);

  events.forEach((ev) => {
    if (!ev.date) return;
    const d = new Date(ev.date);
    const m = d.getUTCMonth(); // 0–11
    if (Number.isInteger(m) && m >= 0 && m < 12) {
      counts[m] += 1;
    }
  });

  return counts.map((value, idx) => ({
    name: MONTH_LABELS[idx],
    value,
  }));
}

/**
 * Mapa súper simplificado lon/lat → región.
 * Luego lo refinamos si quieres algo más fino.
 */
function guessRegionFromCoords(lon, lat) {
  if (lat >= 14 && lat <= 33 && lon >= -118 && lon <= -86) return "México";
  if (lat >= 24 && lat <= 50 && lon >= -125 && lon <= -66) return "EUA";
  if (lat >= -35 && lat <= 37 && lon >= -80 && lon <= -34) return "Sudamérica";
  if (lat >= 35 && lat <= 72 && lon >= -10 && lon <= 40) return "Europa";
  if (lat >= -35 && lat <= 35 && lon >= -20 && lon <= 55) return "Africa";
  if (lat >= 5 && lat <= 55 && lon >= 60 && lon <= 150) return "Asia";
  if (lat >= -50 && lat <= 0 && lon >= 110 && lon <= 180) return "Oceanía";
  if (lat <= -50) return "Antártida";
  return "Otros";
}

/**
 * A partir de eventos de EONET (adapter de getEventsByCategory),
 * agrupa por región aproximada (usada como "country" en la UI).
 *
 * Espera eventos con:
 *  - coordinates: [lon, lat]
 *
 * Devuelve [{ name: "México", label: "México", value: 12 }, ...]
 */
export function groupEventsByRegion(events = []) {
  const map = new Map();

  events.forEach((ev) => {
    const coords = ev.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) return;
    const [lon, lat] = coords;
    if (typeof lon !== "number" || typeof lat !== "number") return;

    const region = guessRegionFromCoords(lon, lat);
    map.set(region, (map.get(region) || 0) + 1);
  });

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name,
      label: name,
      value,
    }));
}
