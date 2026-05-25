import { create } from "zustand";

interface AppState {
  activeDisaster: string;
  setActiveDisaster: (key: string) => void;
  filterMode: "year" | "country" | null;
  setFilterMode: (m: "year" | "country" | null) => void;
  year: number;
  setYear: (y: number) => void;
  country: string | null;
  setCountry: (c: string | null) => void;
  selectedEvent: unknown;
  setSelectedEvent: (ev: unknown) => void;
}

export const useAppStore = create<AppState>((set) => ({
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
