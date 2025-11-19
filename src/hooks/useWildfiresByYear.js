// src/hooks/useWildfiresByYear.js
import { useQuery } from "@tanstack/react-query";
import { getEventsByCategory } from "../api/eonet";
import { groupEventsByMonth } from "../components/stats/dataAdapters";

/**
 * Hook para obtener serie por MES del año para una categoría EONET.
 *
 * @param {{ year: number, categoryId?: string }}
 * Retorna data adaptada para la gráfica: [{ name, value }]
 * name = Mes (Jan, Feb, ...), value = # eventos
 */
export function useWildfiresByYear({ year, categoryId }) {
  const qkey = ["eonet-year-months", categoryId ?? "all", year];

  const query = useQuery({
    queryKey: qkey,
    queryFn: async ({ signal }) => {
      const events = await getEventsByCategory({
        categoryId,     // ej. "wildfires", "earthquakes", "dustHaze"
        year,           // usamos start/end YYYY-01-01 → YYYY-12-31
        status: "all",
        limit: 500,
        // de momento no usamos signal directamente en fetch, pero ya lo tienes por si lo agregas
      });

      // events ya viene adaptado desde eonet.js: { id, title, date, coordinates, categories, raw }
      return groupEventsByMonth(events);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Stats.jsx espera data siempre como array
  return { ...query, data: query.data ?? [] };
}
