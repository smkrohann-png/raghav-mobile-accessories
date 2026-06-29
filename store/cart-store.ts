import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, Coupon } from "@/types";

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (product: Product, quantity?: number, color?: string) => void;
  removeItem: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
  applyCoupon: (coupon: Coupon | null) => void;
  clearCart: () => void;
  getTotals: () => {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product: Product, quantity = 1, color?: string) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedColor === color
          );

          let newItems = [...state.items];
          if (existingItemIndex > -1) {
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity,
            };
          } else {
            newItems.push({ product, quantity, selectedColor: color });
          }

          return { items: newItems };
        });
      },

      removeItem: (productId: string, color?: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedColor === color
              )
          ),
        }));
      },

      updateQuantity: (productId: string, quantity: number, color?: string) => {
        set((state) => {
          const newItems = state.items.map((item) => {
            if (
              item.product.id === productId &&
              item.selectedColor === color
            ) {
              return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
          });
          return { items: newItems };
        });
      },

      applyCoupon: (coupon: Coupon | null) => {
        set({ coupon });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      getTotals: () => {
        const { items, coupon } = get();
        const subtotal = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        let discount = 0;
        if (coupon && coupon.isActive) {
          if (coupon.discountType === "percentage") {
            discount = (subtotal * coupon.value) / 100;
          } else if (coupon.discountType === "fixed") {
            discount = coupon.value;
          }
          if (coupon.minSpend && subtotal < coupon.minSpend) {
            discount = 0; // Did not meet minimum spend requirement
          }
        }

        // Free shipping above 499
        const shipping = subtotal > 0 && subtotal < 499 ? 50 : 0;
        const total = Math.max(0, subtotal - discount + shipping);

        return { subtotal, discount, shipping, total };
      },
    }),
    {
      name: "rma-cart-storage",
    }
  )
);
