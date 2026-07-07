import { create } from "zustand";
import axios from "axios";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CustomerOrder } from "@/types/commerce";

interface AdminStore {
  dashboard: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
  } | null;
  orders: CustomerOrder[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboard: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: string, message?: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set) => ({
  dashboard: null,
  orders: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/admin/dashboard");
      set({
        dashboard: data.stats,
        orders: data.recentOrders,
      });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to fetch dashboard");
      set({ error: message });
      console.error("Fetch dashboard error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/admin/orders");
      set({ orders: data.orders });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to fetch orders");
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (id: string, status: string, message?: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.put(`/api/admin/orders/${id}`, { status, message });
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? data.order : order
        ),
      }));
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to update order");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
