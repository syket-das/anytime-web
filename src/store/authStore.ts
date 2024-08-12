import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set: any) => ({
  session: null,
  user: null,
  loading: true,
  error: null,

  getSession: async () => {
    set({
      loading: true,
    });

    try {
      const { data } = await axios({
        method: "GET",
        url: `${URL}/api/user/profile`,
      });

      set({
        user: data.data,
        loading: false,
        session: data.user,
      });
    } catch (error: any) {
      console.log("error", error.message);

      set({
        loading: false,
        error: error.response?.data || error.message,
        session: null,
      });
    }
  },
}));
