import { create } from "zustand";

export const useAppStore = create((set) => ({
  activeDisaster: "wildfires",
  setActiveDisaster: (key) => set({ activeDisaster: key }),

  // filtros de la vista Stats
  filterMode: null,          // "year" | "country" | null
  setFilterMode: (m) => set({ filterMode: m }),

  year: new Date().getFullYear(),
  setYear: (y) => set({ year: y }),

  country: null,             // "MX", "US", "BR", etc.
  setCountry: (c) => set({ country: c }),

  selectedEvent: null,       // evento para modal
  setSelectedEvent: (ev) => set({ selectedEvent: ev }),
}));
