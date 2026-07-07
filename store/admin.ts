import { create } from "zustand";
import axios from "axios";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CustomerOrder } from "@/types/commerce";
import type { Product } from "@/types/product";
import type { Review } from "@/data/reviews";
import type { AdminRequest, StoreSettings } from "@/lib/db/memory";

interface AdminStore {
  dashboard: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    totalUsers: number;
    pendingReviews: number;
    newRequests: number;
    totalProducts: number;
  } | null;
  orders: CustomerOrder[];
  products: Product[];
  reviews: Review[];
  requests: AdminRequest[];
  settings: StoreSettings | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboard: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: string, message?: string) => Promise<void>;
  fetchProducts: () => Promise<void>;
  saveProduct: (product: Partial<Product> & { id?: string }) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  fetchReviews: () => Promise<void>;
  updateReviewStatus: (id: string, status: Review["status"]) => Promise<void>;
  fetchRequests: () => Promise<void>;
  updateRequestStatus: (id: string, status: AdminRequest["status"]) => Promise<void>;
  fetchSettings: () => Promise<void>;
  saveSettings: (settings: Partial<StoreSettings>) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set) => ({
  dashboard: null,
  orders: [],
  products: [],
  reviews: [],
  requests: [],
  settings: null,
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

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/admin/products");
      set({ products: data.products });
    } catch (error: unknown) {
      set({ error: getApiErrorMessage(error, "Failed to fetch products") });
    } finally {
      set({ isLoading: false });
    }
  },

  saveProduct: async (product) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = product.id
        ? await axios.put(`/api/admin/products/${product.id}`, product)
        : await axios.post("/api/admin/products", product);
      set((state) => ({
        products: product.id
          ? state.products.map((item) => (item.id === data.product.id ? data.product : item))
          : [data.product, ...state.products],
      }));
    } catch (error: unknown) {
      set({ error: getApiErrorMessage(error, "Failed to save product") });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`/api/admin/products/${id}`);
      set((state) => ({ products: state.products.filter((product) => product.id !== id) }));
    } catch (error: unknown) {
      set({ error: getApiErrorMessage(error, "Failed to delete product") });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReviews: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/admin/reviews");
      set({ reviews: data.reviews });
    } catch (error: unknown) {
      set({ error: getApiErrorMessage(error, "Failed to fetch reviews") });
    } finally {
      set({ isLoading: false });
    }
  },

  updateReviewStatus: async (id, status) => {
    const { data } = await axios.patch(`/api/admin/reviews/${id}`, { status });
    set((state) => ({ reviews: state.reviews.map((review) => (review.id === id ? data.review : review)) }));
  },

  fetchRequests: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/admin/requests");
      set({ requests: data.requests });
    } catch (error: unknown) {
      set({ error: getApiErrorMessage(error, "Failed to fetch requests") });
    } finally {
      set({ isLoading: false });
    }
  },

  updateRequestStatus: async (id, status) => {
    const { data } = await axios.patch(`/api/admin/requests/${id}`, { status });
    set((state) => ({ requests: state.requests.map((request) => (request.id === id ? data.request : request)) }));
  },

  fetchSettings: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/admin/settings");
      set({ settings: data.settings });
    } catch (error: unknown) {
      set({ error: getApiErrorMessage(error, "Failed to fetch settings") });
    } finally {
      set({ isLoading: false });
    }
  },

  saveSettings: async (settings) => {
    const { data } = await axios.put("/api/admin/settings", settings);
    set({ settings: data.settings });
  },
}));
