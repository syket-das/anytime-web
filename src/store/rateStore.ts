import { create } from "zustand";

export const useRate = create((set) => {
  return {
    rates: [],
    lastRate: null,
    loading: false,
    error: null,
    getRates: async () => {
      try {
        set({ loading: true });
        const response = await fetch("/api/exchange-rate");
        const data = await response.json();
        set({ rates: data.data });
        set({ lastRate: data.data[data.data.length - 1] });
      } catch (error) {
        set({ error });
      } finally {
        set({ loading: false });
      }
    },
  };
});
