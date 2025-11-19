// src/hooks/useWildfiresByCountry.js
import { useQuery } from "@tanstack/react-query";
import { getEventsByCategory } from "../api/eonet";
import { groupEventsByRegion } from "../components/stats/dataAdapters";

/**
 * Hook para obtener serie por región/país aproximado para una categoría EONET.
 *
 * @param {{ year?: number, categoryId?: string }}
 * Retorna data adaptada para la gráfica y ranking:
 *  [{ name, label, value }]
 */
export function useWildfiresByCountry({ year, categoryId }) {
  const qkey = ["eonet-country-region", categoryId ?? "all", year ?? "all"];

  const query = useQuery({
    queryKey: qkey,
    queryFn: async ({ signal }) => {
      const events = await getEventsByCategory({
        categoryId,  // ej. "wildfires"
        year,        // si viene, filtramos eventos de ese año; si no, API usa rango más amplio según config
        status: "all",
        limit: 500,
      });

      // Agrupamos por región aproximada según lon/lat
      return groupEventsByRegion(events);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { ...query, data: query.data ?? [] };
}
