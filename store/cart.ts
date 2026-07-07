import { create } from "zustand";
import axios from "axios";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CartItem } from "@/types/auth";
import type { Product } from "@/types/product";

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

interface Cart {
  id: string;
  userId: string;
  items: CartItemWithProduct[];
  updatedAt: Date;
}

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/api/cart");
      set({ cart: data });
    } catch (error: unknown) {
      console.error("Fetch cart error:", error);
      set({ error: getApiErrorMessage(error, "Failed to fetch cart") });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: string, quantity: number) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post("/api/cart", { productId, quantity });
      set({ cart: data.cart });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to add to cart");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.delete(`/api/cart/${productId}`);
      set({ cart: data.cart });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to remove item");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.put(`/api/cart/${productId}`, { quantity });
      set({ cart: data.cart });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Failed to update quantity");
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: () => {
    set({ cart: null, error: null });
  },

  getTotalPrice: () => {
    const state = get();
    if (!state.cart) return 0;
    return state.cart.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  },

  getTotalItems: () => {
    const state = get();
    if (!state.cart) return 0;
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  },
}));
