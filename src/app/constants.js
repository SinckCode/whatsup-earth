// src/app/constants.js

// Lista para usar en el Home / carrusel
export const DISASTERS = [
  {
    key: "wildfires",
    label: "WILDFIRES",
    bg: "/assets/hero/wildfires.jpg",

    // --- NUEVO ---
    theme: "wildfires", // usado por StatsScene: stats-scene--wildfires
    title: "Wildfires",
    subtitle: "Active fire events across the globe",

    // Para los charts
    unitYear: "events per year",
    unitCountry: "events per country",

    // Para EONET
    eonetCategorySlug: "wildfires", // para ?category=wildfires
    eonetCategoryId: 8,             // si lo necesitas por id numérico
  },
  {
    key: "earthquakes",
    label: "EARTHQUAKES",
    bg: "/assets/hero/earthquakes.jpg",

    theme: "earthquakes",
    title: "Earthquakes",
    subtitle: "Recent seismic activity around the world",

    unitYear: "events per year",
    unitCountry: "events per country",

    eonetCategorySlug: "earthquakes",
    eonetCategoryId: 16,
  },
  {
    key: "dust-haze",
    label: "DUST HAZE",
    bg: "/assets/hero/dusthaze.jpg",

    theme: "dust-haze",
    title: "Dust & Haze",
    subtitle: "Major dust and haze events",

    unitYear: "events per year",
    unitCountry: "events per country",

    eonetCategorySlug: "dustHaze",
    eonetCategoryId: 7,
  },
  {
    key: "sea-lake-ice",
    label: "SEA & LAKE ICE",
    bg: "/assets/hero/seaLakeIce.jpg",

    theme: "sea-lake-ice",
    title: "Sea & Lake Ice",
    subtitle: "Ice coverage and break-up events",

    unitYear: "events per year",
    unitCountry: "events per region",

    eonetCategorySlug: "seaLakeIce",
    // eonetCategoryId: 15, // si luego quieres usar id numérico
  },
  {
    key: "severe-storms",
    label: "SEVERE STORMS",
    bg: "/assets/hero/severeStorms.jpg",

    theme: "severe-storms",
    title: "Severe Storms",
    subtitle: "Hurricanes, cyclones and major storms",

    unitYear: "events per year",
    unitCountry: "events per region",

    eonetCategorySlug: "severeStorms",
  },
  {
    key: "volcanoes",
    label: "VOLCANOES",
    bg: "/assets/hero/volcanoes.jpg",

    theme: "volcanoes",
    title: "Volcanoes",
    subtitle: "Volcanic activity worldwide",

    unitYear: "events per year",
    unitCountry: "events per region",

    eonetCategorySlug: "volcanoes",
  },
];

// Mapa rápido key → objeto, útil en Stats.jsx
export const DISASTERS_BY_KEY = DISASTERS.reduce((acc, d) => {
  acc[d.key] = d;
  return acc;
}, {});

// Helper para resolver un desastre desde la URL
export function resolveDisaster(key) {
  return DISASTERS_BY_KEY[key] || DISASTERS_BY_KEY["wildfires"];
}
