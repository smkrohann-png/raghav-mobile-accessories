import { create } from "zustand";
import axios from "axios";
import { getApiErrorMessage } from "@/lib/api-error";
import type { User } from "@/types/auth";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  checkAuth: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    username?: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<string>;
  resetPassword: (resetToken: string, password: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/auth/me");
      if (data.isAuthenticated) {
        set({
          user: data.user,
          isAuthenticated: true,
        });
      }
    } catch {
      set({
        isAuthenticated: false,
        user: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (identifier: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post("/api/auth/login", { identifier, password });
      set({
        user: data.user,
        isAuthenticated: true,
      });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Login failed");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post("/api/auth/register", userData);
      set({
        user: data.user,
        isAuthenticated: true,
      });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Registration failed");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await axios.post("/api/auth/logout");
      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Logout failed");
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post("/api/auth/forgot-password", { email });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to initiate reset");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post("/api/auth/verify-otp", { email, otp });
      return data.resetToken;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Invalid OTP");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (resetToken, password) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post("/api/auth/reset-password", { resetToken, password });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to reset password");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
