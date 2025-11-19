// src/eonet/eonet.js
const BASE = "https://eonet.gsfc.nasa.gov/api/v3";

/**
 * Adaptador mínimo: normaliza un evento EONET a algo manejable.
 */
function adaptEvent(e) {
  const firstGeom = Array.isArray(e.geometry) ? e.geometry[0] : null;

  return {
    id: e.id,
    title: e.title,
    description: e.description ?? "",
    date: firstGeom?.date ?? e.closed ?? null,
    coordinates: firstGeom?.coordinates ?? null,
    categories: (e.categories ?? []).map((c) => c.id),
    magnitude: e.magnitudeValue ?? null,
    raw: e,
  };
}

/**
 * Fetch genérico de eventos por categoría.
 *
 * Docs EONET v3:
 *   GET /events
 *   - category: Category ID (string, ej: "wildfires", "earthquakes", "dustHaze")
 *   - status: "open" | "closed" | "all" (por defecto solo open)
 *   - limit: número de eventos
 *   - days: ventana de días hacia atrás
 *   - start/end: rango YYYY-MM-DD
 */
export async function getEventsByCategory({
  categoryId,     // "wildfires" | "earthquakes" | "dustHaze" | ...
  year,           // número de año (opcional)
  start,          // YYYY-MM-DD (opcional)
  end,            // YYYY-MM-DD (opcional)
  days,           // ventana en días (opcional)
  status = "all", // queremos abiertos y cerrados para estadísticas
  limit = 500,
  signal,
} = {}) {
  const params = new URLSearchParams();

  // categoría → según docs, es el "Category ID" (ej. "wildfires")
  if (categoryId) params.set("category", String(categoryId));

  // status: open / closed / all
  if (status) params.set("status", status);

  // límite de eventos
  if (typeof limit === "number") params.set("limit", String(limit));

  // Rango de fechas: prioridad a start/end si se pasan; si no, days
  if (year && !start && !end) {
    // Modo "año completo"
    start = `${year}-01-01`;
    end = `${year}-12-31`;
  }

  if (start && end) {
    params.set("start", start);
    params.set("end", end);
  } else if (days) {
    params.set("days", String(days));
  }

  const url = `${BASE}/events?${params.toString()}`;
  // console.log("[EONET] GET", url);

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`EONET error ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const events = Array.isArray(data.events) ? data.events : [];
  return events.map(adaptEvent);
}

/**
 * Por si quieres un helper específico de "año":
 *
 * Devuelve todos los eventos de una categoría en ese año,
 * ya adaptados.
 */
export async function getEventsForYear({ categoryId, year, signal }) {
  return getEventsByCategory({
    categoryId,
    year,
    status: "all",
    limit: 1000,
    signal,
  });
}

/**
 * Placeholder de país por coordenadas.
 * (sigue igual por ahora)
 */
export async function countryFromCoords([lon, lat]) {
  void lon;
  void lat;
  return null;
}
