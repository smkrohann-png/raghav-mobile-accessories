import { products } from "@/data/storefront";
import type { CustomerOrder, OrderStatus } from "@/types/commerce";

export const orderStatuses: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

export const dashboardOrder: CustomerOrder = {
  id: "RMA-2407-1182",
  customer: "Raghav Customer",
  phone: "+91 7206040798",
  address: "Khera Mohalla, Near New Market, Yamunanagar, Haryana 135001",
  date: "2026-07-01",
  amount: 4697,
  status: "Shipped",
  paymentMethod: "Cash On Delivery",
  paymentStatus: "Pending Payment",
  shippingProvider: "Shiprocket",
  shippingStatus: "Booked",
  products: products.slice(0, 3),
  messages: [
    {
      status: "Pending",
      text: "Your order has been received and is waiting for confirmation.",
      time: "10:12 AM",
    },
    {
      status: "Confirmed",
      text: "Your order has been accepted.",
      time: "10:28 AM",
    },
    {
      status: "Packed",
      text: "Your order will be delivered within 3-4 business days.",
      time: "12:40 PM",
    },
    {
      status: "Shipped",
      text: "Your package has been shipped.",
      time: "4:15 PM",
    },
  ],
};

export const adminOrders: CustomerOrder[] = [
  dashboardOrder,
  {
    id: "RMA-2407-1183",
    customer: "Nisha Rao",
    phone: "+91 90000 11883",
    address: "14 Studio Lane, Pune, Maharashtra 411001",
    date: "2026-07-01",
    amount: 4298,
    status: "Confirmed",
    paymentMethod: "Cash On Delivery",
    paymentStatus: "Pending Payment",
    shippingProvider: "Shiprocket",
    shippingStatus: "Pending",
    products: [products[2], products[4]],
    messages: [
      {
        status: "Pending",
        text: "Your order has been received and is waiting for confirmation.",
        time: "9:05 AM",
      },
      {
        status: "Confirmed",
        text: "Your order has been accepted.",
        time: "9:32 AM",
      },
    ],
  },
  {
    id: "RMA-2407-1184",
    customer: "Kabir Sethi",
    phone: "+91 90000 11884",
    address: "8 Campus Road, Delhi 110007",
    date: "2026-06-30",
    amount: 1899,
    status: "Out For Delivery",
    paymentMethod: "Cash On Delivery",
    paymentStatus: "Pending Payment",
    shippingProvider: "Shiprocket",
    shippingStatus: "Booked",
    products: [products[3]],
    messages: [
      {
        status: "Shipped",
        text: "Your package has been shipped.",
        time: "Yesterday",
      },
      {
        status: "Out For Delivery",
        text: "Your order is out for delivery.",
        time: "Today",
      },
    ],
  },
];

export const statusMessages: Record<OrderStatus, string> = {
  Pending: "Your order is waiting for confirmation.",
  Confirmed: "Your order has been accepted.",
  Packed: "Your order will be delivered within 3-4 business days.",
  Shipped: "Your package has been shipped.",
  "Out For Delivery": "Your order is out for delivery.",
  Delivered: "Your order has been delivered successfully.",
  Cancelled: "Your order has been cancelled.",
};
