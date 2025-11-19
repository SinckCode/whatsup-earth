// statsThemes.js
export const STATS_THEMES = {
  wildfires: {
    key: "wildfires",
    title: "Wildfires",
    subtitle: "Incendios activos en la Tierra",
    eonetCategoryId: "wildfires",
    unitYear: "eventos por año",
    unitCountry: "eventos por país",
  },
  severeStorms: {
    key: "severeStorms",
    title: "Severe storms",
    subtitle: "Tormentas severas rastreadas por EONET",
    eonetCategoryId: "severeStorms",
    unitYear: "tormentas por año",
    unitCountry: "tormentas por país",
  },
  volcanoes: {
    key: "volcanoes",
    title: "Volcanoes",
    subtitle: "Actividad volcánica reciente",
    eonetCategoryId: "volcanoes",
    unitYear: "erupciones por año",
    unitCountry: "erupciones por país",
  },
};

export function resolveStatsTheme(key) {
  return STATS_THEMES[key] ?? STATS_THEMES.wildfires;
}
