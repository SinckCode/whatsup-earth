// src/hooks/useEonetByYear.js
import { useQuery } from "@tanstack/react-query";
import { getEventsByCategory } from "../api/eonet";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Serie por MES para un año y una categoría EONET.
 * Devuelve [{ name, value }]
 */
export function useEonetByYear({ categorySlug, year }) {
  const query = useQuery({
    queryKey: ["eonet-year", categorySlug, year],
    queryFn: async ({ signal }) => {
      const events = await getEventsByCategory({
        categoryId: categorySlug,
        year,
        status: "all",
        limit: 500,
        signal,
      });

      const buckets = new Array(12).fill(0);

      events.forEach((ev) => {
        if (!ev.date) return;
        const d = new Date(ev.date);
        if (Number.isNaN(d.getTime())) return;
        const m = d.getUTCMonth();
        if (m >= 0 && m < 12) buckets[m] += 1;
      });

      return buckets.map((value, idx) => ({
        name: MONTH_LABELS[idx],
        value,
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { ...query, data: query.data ?? [] };
}
