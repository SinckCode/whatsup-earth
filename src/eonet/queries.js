// src/eonet/queries.js

import { getEventsByCategory } from "../api/eonet";

/**
 * Agrupa eventos por mes (Jan–Dec) para el año/categoría dados.
 * Este fetcher es genérico aunque se llame "Wildfires": funciona para
 * cualquier categoryId que le pases desde Stats.jsx.
 */
export async function fetchWildfiresByYear({ year, categoryId, signal }) {
  const events = await getEventsByCategory({
    categoryId,
    year,
    status: "all",
    limit: 1000,
    signal,
  });

  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const counts = new Array(12).fill(0);

  for (const ev of events) {
    if (!ev.date) continue;
    const d = new Date(ev.date);
    if (Number.isNaN(d.getTime())) continue;
    const m = d.getUTCMonth(); // 0–11
    counts[m] += 1;
  }

  return MONTH_LABELS.map((label, i) => ({
    label,
    count: counts[i],
  }));
}

/**
 * Agrupa eventos por región aproximada en función de lon/lat.
 * Esto evita usar APIs externas de geocoding.
 */
export async function fetchWildfiresByCountry({ year, categoryId, signal }) {
  const events = await getEventsByCategory({
    categoryId,
    year,
    status: "all",
    limit: 1000,
    signal,
  });

  const buckets = new Map();

  for (const ev of events) {
    const coords = normalizePointCoords(ev.coordinates);
    if (!coords) continue;
    const [lon, lat] = coords;
    const region = inferRegionFromLonLat(lon, lat);

    buckets.set(region, (buckets.get(region) ?? 0) + 1);
  }

  // Adaptamos a forma simple [{ country, total }]
  return Array.from(buckets.entries()).map(([country, total]) => ({
    country,
    total,
  }));
}

/* ============================
   Helpers internos
   ============================ */

/**
 * Si viene un Polygon u otro formato, intentamos sacar un solo [lon, lat].
 */
function normalizePointCoords(coords) {
  if (!coords) return null;

  // Caso Point [lon, lat]
  if (Array.isArray(coords) && typeof coords[0] === "number") {
    const [lon, lat] = coords;
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return [lon, lat];
  }

  // Caso Polygon: [[ [lon, lat], ... ]]
  if (
    Array.isArray(coords) &&
    Array.isArray(coords[0]) &&
    Array.isArray(coords[0][0])
  ) {
    const [lon, lat] = coords[0][0];
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return [lon, lat];
  }

  return null;
}

/**
 * Inferimos "regiones" grandes a partir de lon/lat.
 * No es perfecto, pero da un mapa mundial decente:
 * - Norteamérica
 * - Sudamérica
 * - Europa
 * - África
 * - Asia
 * - Oceanía
 * - Otros
 */
function inferRegionFromLonLat(lon, lat) {
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return "Otros";

  // Normalizamos lon a [-180, 180]
  let L = lon;
  if (L > 180) L -= 360;
  if (L < -180) L += 360;

  // Polar / sin región clara
  if (lat > 75 || lat < -60) return "Otros";

  // América
  if (L >= -170 && L <= -30) {
    return lat >= 0 ? "Norteamérica" : "Sudamérica";
  }

  // Europa / África (longitudes entre -30 y 60 aprox.)
  if (L > -30 && L <= 60) {
    return lat >= 0 ? "Europa" : "África";
  }

  // Asia (60 a 150 aprox., lat>0)
  if (L > 60 && L <= 150 && lat >= 0) return "Asia";

  // Oceanía (100 a 180 aprox., lat<0)
  if (L >= 100 && L <= 180 && lat < 0) return "Oceanía";

  // Resto (islas, zonas ambiguas, etc.)
  return "Otros";
}
