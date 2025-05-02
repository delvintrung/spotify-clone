import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
  isAdmin: boolean;
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;

  checkAdminStatus: () => Promise<void>;
  checkPremiumStatus: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isPremium: false,
  isLoading: false,
  error: null,

  checkAdminStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/check-admin");
      set({ isAdmin: response.data.admin });
    } catch (error: any) {
      set({ isAdmin: false, error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  checkPremiumStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users/check-premium");
      set({ isPremium: response.data.isPremium });
    } catch (error: any) {
      set({ isPremium: false, error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({ isAdmin: false, isLoading: false, error: null });
  },
}));
