import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";

export const useBankStore = create((set, get) => ({
  banks: [],
  error: null,
  loading: false,
  getBanks: async () => {
    set({ loading: true });

    try {
      const { data } = await axios({
        method: "GET",
        url: `/api/user/userbank`,
      });

      set({ banks: data.data, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data.error || error.message,
      });
    }
  },

  addBank: async (bank: any) => {
    set({ loading: true });

    try {
      const { data } = await axios({
        method: "POST",
        url: `/api/user/userbank`,

        data: bank,
      });

      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false,
      });
      throw new Error(error.response?.data?.error || error.message);
    }
  },
}));
