import { create } from "zustand";
import axios from "axios";

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  error: null,
  loading: false,
  balance: 0,
  depositWallets: [],
  getTransactions: async () => {
    set({ loading: true });

    try {
      const { data } = await axios({
        method: "GET",
        url: `/api/user/transaction`,
      });

      set({ transactions: data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deposit: async (transactionId: string) => {
    set({ loading: true });
    try {
      const { data } = await axios({
        method: "POST",
        url: `/api/user/deposit/verify`,

        data: {
          transactionId,
        },
      });

      console.log("data", data);

      set({ loading: false });
    } catch (error: any) {
      console.log("error", error);

      set({
        error: error?.response?.data?.error || error.message,
        loading: false,
      });
      throw new Error(error?.response?.data?.error || error.message);
    }
  },

  withdraw: async (d: any) => {
    set({ loading: true });
    try {
      const { data } = await axios({
        method: "POST",
        url: `/api/user/withdraw`,

        data: d,
      });

      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw new Error(error?.response?.data?.error || error.message);
    }
  },
  exchange: async (d: any) => {
    try {
      const { data } = await axios({
        method: "POST",
        url: `/api/user/exchange`,

        data: d,
      });

      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw new Error(error?.response?.data?.error || error.message);
    }
  },

  getDepositWallets: async () => {
    set({ loading: true });
    try {
      const { data } = await axios({
        method: "GET",
        url: `/api/user/deposit`,
      });

      set({ loading: false, depositWallets: data.data });
    } catch (error) {}
  },

  getBalance: async () => {
    try {
      const { data } = await axios({
        method: "GET",
        url: `/api/user/balance`,
      });

      set({ balance: data.data.balance });
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || error.message);
    }
  },

  clearError: () => set({ error: null }),
}));
