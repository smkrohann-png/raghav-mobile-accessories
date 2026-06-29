import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Address } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<boolean>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  addAddress: (address: Address) => void;
  removeAddress: (index: number) => void;
  updateProfile: (name: string, phone?: string, avatar?: string) => void;
}

const mockDefaultUser: User = {
  id: "u-1",
  name: "Raghav Kumar",
  email: "raghav@example.com",
  role: "admin",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  addresses: [
    {
      name: "Raghav Kumar",
      phone: "+91 98765 43210",
      line1: "123, Sector 15",
      line2: "Opposite Town Park",
      city: "Ambala",
      state: "Haryana",
      pincode: "133001",
      country: "India",
    },
  ],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, name?: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // If logging in as admin or standard user
        const isDefault = email === "raghav@example.com" || email === "admin@raghavmobile.com";
        const loggedUser: User = isDefault
          ? mockDefaultUser
          : {
              id: `u-${Math.random().toString(36).substr(2, 9)}`,
              name: name || email.split("@")[0],
              email,
              role: email.includes("admin") ? "admin" : "user",
              addresses: [],
            };

        set({ user: loggedUser, isAuthenticated: true });
        return true;
      },

      register: async (name: string, email: string) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const newUser: User = {
          id: `u-${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          role: email.includes("admin") ? "admin" : "user",
          addresses: [],
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      addAddress: (address: Address) => {
        set((state) => {
          if (!state.user) return {};
          const updatedAddresses = [...state.user.addresses, address];
          return {
            user: {
              ...state.user,
              addresses: updatedAddresses,
            },
          };
        });
      },

      removeAddress: (index: number) => {
        set((state) => {
          if (!state.user) return {};
          const updatedAddresses = state.user.addresses.filter((_, i) => i !== index);
          return {
            user: {
              ...state.user,
              addresses: updatedAddresses,
            },
          };
        });
      },

      updateProfile: (name: string, phone?: string, avatar?: string) => {
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              name,
              phone: phone || state.user.phone,
              avatar: avatar || state.user.avatar,
            },
          };
        });
      },
    }),
    {
      name: "rma-auth-storage",
    }
  )
);
