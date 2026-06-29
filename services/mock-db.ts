import { Order, Coupon, User } from "@/types";

const INITIAL_COUPONS: Coupon[] = [
  {
    code: "SUMMER40",
    discountType: "percentage",
    value: 40,
    minSpend: 999,
    expiryDate: "2026-08-31",
    isActive: true,
  },
  {
    code: "WELCOME100",
    discountType: "fixed",
    value: 100,
    minSpend: 499,
    expiryDate: "2026-12-31",
    isActive: true,
  },
  {
    code: "FREESHIP",
    discountType: "percentage",
    value: 0,
    expiryDate: "2026-12-31",
    isActive: true,
  },
];

export const getStoredOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("rma-orders");
  return stored ? JSON.parse(stored) : [];
};

export const saveStoredOrder = (order: Order): void => {
  if (typeof window === "undefined") return;
  const current = getStoredOrders();
  localStorage.setItem("rma-orders", JSON.stringify([order, ...current]));
};

export const updateStoredOrderStatus = (orderId: string, status: Order["status"]): void => {
  if (typeof window === "undefined") return;
  const current = getStoredOrders();
  const updated = current.map((ord) =>
    ord.id === orderId ? { ...ord, status } : ord
  );
  localStorage.setItem("rma-orders", JSON.stringify(updated));
};

export const getStoredCoupons = (): Coupon[] => {
  if (typeof window === "undefined") return INITIAL_COUPONS;
  const stored = localStorage.getItem("rma-coupons");
  if (!stored) {
    localStorage.setItem("rma-coupons", JSON.stringify(INITIAL_COUPONS));
    return INITIAL_COUPONS;
  }
  return JSON.parse(stored);
};

export const addStoredCoupon = (coupon: Coupon): void => {
  if (typeof window === "undefined") return;
  const current = getStoredCoupons();
  localStorage.setItem("rma-coupons", JSON.stringify([coupon, ...current]));
};

export const validateCouponCode = (code: string, subtotal: number): { success: boolean; coupon?: Coupon; message: string } => {
  const coupons = getStoredCoupons();
  const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);

  if (!found) {
    return { success: false, message: "Invalid or expired coupon code." };
  }

  // Check expiry
  if (new Date(found.expiryDate) < new Date()) {
    return { success: false, message: "This coupon code has expired." };
  }

  // Check min spend
  if (found.minSpend && subtotal < found.minSpend) {
    return {
      success: false,
      message: `Minimum purchase of ₹${found.minSpend} is required for this coupon.`,
    };
  }

  return { success: true, coupon: found, message: "Coupon applied successfully!" };
};
