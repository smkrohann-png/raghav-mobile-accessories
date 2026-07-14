import { create } from "zustand";
import axios from "axios";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CustomerOrder } from "@/types/commerce";
import type { Address, User } from "@/types/auth";

type ProfileUpdate = Partial<Pick<User, "firstName" | "lastName" | "email" | "phone">>;
type AddressInput = Omit<Address, "id" | "userId" | "createdAt">;

interface ProfileStore {
  profile: User | null;
  addresses: Address[];
  orders: CustomerOrder[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdate) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;

  // Address actions
  fetchAddresses: () => Promise<void>;
  addAddress: (data: AddressInput) => Promise<void>;
  updateAddress: (id: string, data: Partial<AddressInput>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;

  // Order actions
  fetchOrders: () => Promise<void>;
  getOrderDetail: (id: string) => Promise<CustomerOrder | null>;
  cancelOrder: (id: string) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  addresses: [],
  orders: [],
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/profile");
      set({
        profile: data.user,
        addresses: data.addresses,
        orders: data.orders,
      });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to fetch profile");
      set({ error: message });
      console.error("Fetch profile error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put("/api/profile", data);
      set(() => ({
        profile: response.data.user,
      }));
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to update profile");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post("/api/profile/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to change password");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAddresses: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/profile/addresses");
      set({ addresses: data.addresses });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to fetch addresses");
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  addAddress: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post("/api/profile/addresses", data);
      set((state) => ({
        addresses: [...state.addresses, response.data.address],
      }));
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to add address");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAddress: async (id: string, data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put(`/api/profile/addresses/${id}`, data);
      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr.id === id ? response.data.address : addr
        ),
      }));
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to update address");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAddress: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`/api/profile/addresses/${id}`);
      set((state) => ({
        addresses: state.addresses.filter((addr) => addr.id !== id),
      }));
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to delete address");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/orders");
      set({ orders: data.orders });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to fetch orders");
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  getOrderDetail: async (id: string) => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`);
      return data.order;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to fetch order");
      set({ error: message });
      return null;
    }
  },

  cancelOrder: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`/api/orders/${id}/cancel`);
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? response.data.order : order
        ),
      }));
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to cancel order");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
