// src/hooks/useEonetByRegion.js
import { useQuery } from "@tanstack/react-query";
import { getEventsByCategory } from "../api/eonet";

/**
 * Hook para serie por región aproximada (usada como "country").
 * Devuelve [{ name, label, value }]
 */
export function useEonetByRegion({ categorySlug, year }) {
  const query = useQuery({
    queryKey: ["eonet-region", categorySlug, year],
    queryFn: async ({ signal }) => {
      const events = await getEventsByCategory({
        categoryId: categorySlug,
        year,
        status: "all",
        limit: 500,
        signal,
      });

      const counts = {};

      events.forEach((ev) => {
        const coords = ev.coordinates;
        if (!Array.isArray(coords) || coords.length < 2) return;

        const [lon, lat] = coords;
        if (
          typeof lon !== "number" ||
          typeof lat !== "number" ||
          Number.isNaN(lon) ||
          Number.isNaN(lat)
        ) {
          return;
        }

        const region = roughRegion(lat, lon);
        counts[region] = (counts[region] || 0) + 1;
      });

      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({
          name,
          label: name,
          value,
        }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { ...query, data: query.data ?? [] };
}

/**
 * Mapa MUY simple lat/lon -> región.
 * Luego lo podemos hacer ultra-fino, pero por ahora nos da algo visual.
 */
function roughRegion(lat, lon) {
  // USA / México
  if (lat > 15 && lat < 40 && lon > -130 && lon < -60) return "USA / México";
  // América del Sur
  if (lat < 15 && lon > -80 && lon < -30) return "América del Sur";
  // Europa / Mediterráneo
  if (lat > 35 && lat < 65 && lon > -15 && lon < 40) return "Europa / Med.";
  // África
  if (lat > -35 && lat < 30 && lon > -20 && lon < 55) return "África";
  // Asia
  if (lat > 5 && lon > 55 && lon < 150) return "Asia";
  // Oceanía
  if (lat < 0 && lon > 110 && lon < 180) return "Oceanía";
  return "Otros";
}
