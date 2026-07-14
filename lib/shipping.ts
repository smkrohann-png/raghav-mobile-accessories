import type { CustomerOrder } from "@/types/commerce";

type ShiprocketOrderItem = {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
};

type CreateShiprocketOrderInput = {
  order: CustomerOrder;
  items: ShiprocketOrderItem[];
  billingCustomerName: string;
  billingLastName?: string;
  billingEmail: string;
  billingPhone: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
};

type ShiprocketCreateOrderResponse = {
  order_id?: number | string;
  shipment_id?: number | string;
  awb_code?: string;
};

const shiprocketApiBase = "https://apiv2.shiprocket.in/v1/external";

export function isShiprocketConfigured() {
  return Boolean(
    process.env.SHIPROCKET_EMAIL &&
      process.env.SHIPROCKET_PASSWORD &&
      process.env.SHIPROCKET_PICKUP_LOCATION,
  );
}

async function getShiprocketToken() {
  const response = await fetch(`${shiprocketApiBase}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.token) {
    throw new Error(data.message || "Shiprocket login failed");
  }

  return String(data.token);
}

export async function createShiprocketOrder(input: CreateShiprocketOrderInput) {
  if (!isShiprocketConfigured()) {
    return {
      configured: false as const,
      reason: "Shiprocket credentials are not configured",
    };
  }

  const token = await getShiprocketToken();
  const response = await fetch(`${shiprocketApiBase}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order_id: input.order.id,
      order_date: input.order.date.slice(0, 10),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
      channel_id: process.env.SHIPROCKET_CHANNEL_ID || undefined,
      billing_customer_name: input.billingCustomerName,
      billing_last_name: input.billingLastName || "",
      billing_address: input.billingAddress,
      billing_city: input.billingCity,
      billing_pincode: input.billingPincode,
      billing_state: input.billingState,
      billing_country: "India",
      billing_email: input.billingEmail,
      billing_phone: input.billingPhone.replace(/\D/g, "").slice(-10),
      shipping_is_billing: true,
      order_items: input.items,
      payment_method: "COD",
      sub_total: input.order.amount,
      length: Number(process.env.SHIPROCKET_DEFAULT_LENGTH_CM || 10),
      breadth: Number(process.env.SHIPROCKET_DEFAULT_BREADTH_CM || 10),
      height: Number(process.env.SHIPROCKET_DEFAULT_HEIGHT_CM || 5),
      weight: Number(process.env.SHIPROCKET_DEFAULT_WEIGHT_KG || 0.5),
    }),
  });

  const data = (await response.json()) as ShiprocketCreateOrderResponse & { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Shiprocket order creation failed");
  }

  return {
    configured: true as const,
    orderId: data.order_id ? String(data.order_id) : undefined,
    shipmentId: data.shipment_id ? String(data.shipment_id) : undefined,
    awbCode: data.awb_code,
  };
}

export async function cancelShiprocketOrder(shiprocketOrderId: string) {
  if (!isShiprocketConfigured()) {
    return { configured: false as const, reason: "Shiprocket not configured" };
  }

  const token = await getShiprocketToken();
  const response = await fetch(`${shiprocketApiBase}/orders/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: [Number(shiprocketOrderId)] }),
  });

  const data = (await response.json()) as { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Shiprocket order cancellation failed");
  }

  return { configured: true as const, cancelled: true };
}
