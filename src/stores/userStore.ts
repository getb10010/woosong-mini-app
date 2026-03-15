import { create } from "zustand";
import api from "../api/client";

interface UserState {
  user: any | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  error: null,
  fetchUser: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get("/auth/me");
      set({ user: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));