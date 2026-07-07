import type { Product } from "@/types/product";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out For Delivery"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "Pending Payment" | "Payment Success" | "Payment Failed";

export type PaymentMethod = "Cash On Delivery";

export type ShippingStatus = "Pending" | "Booked" | "Failed" | "Not Configured";

export type CustomerOrder = {
  id: string;
  customer: string;
  customerName?: string;
  customerEmail?: string;
  phone: string;
  address: string;
  date: string;
  amount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentFailureReason?: string;
  shippingProvider?: "Shiprocket";
  shippingStatus?: ShippingStatus;
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  shiprocketAwbCode?: string;
  shippingFailureReason?: string;
  products: Product[];
  messages: {
    status: OrderStatus;
    text: string;
    time: string;
  }[];
};
