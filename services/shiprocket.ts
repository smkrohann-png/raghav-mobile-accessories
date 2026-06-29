import { Address, OrderItem } from "@/types";

export interface ShiprocketRateEstimate {
  courierName: string;
  rate: number;
  estimatedDeliveryDays: number;
  rating: number;
}

/**
 * Simulates calling Shiprocket APIs for calculating delivery rates.
 */
export async function calculateShippingRates(
  pickupPincode: string,
  deliveryPincode: string,
  weightKg: number,
  orderValue: number
): Promise<ShiprocketRateEstimate[]> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // If distance is far (mocked by pincode differences)
  const codeDiff = Math.abs(parseInt(pickupPincode) - parseInt(deliveryPincode));
  const baseRate = codeDiff % 2 === 0 ? 40 : 60;
  const weightCharge = Math.ceil(weightKg) * 15;

  return [
    {
      courierName: "Delhivery Direct",
      rate: baseRate + weightCharge,
      estimatedDeliveryDays: codeDiff % 3 === 0 ? 3 : 5,
      rating: 4.8,
    },
    {
      courierName: "BlueDart Premium",
      rate: baseRate + weightCharge + 40,
      estimatedDeliveryDays: codeDiff % 3 === 0 ? 2 : 3,
      rating: 4.9,
    },
    {
      courierName: "ExpressBees Saver",
      rate: Math.max(40, baseRate + weightCharge - 15),
      estimatedDeliveryDays: codeDiff % 3 === 0 ? 4 : 6,
      rating: 4.2,
    },
  ];
}

/**
 * Simulates creating a shipment / order inside Shiprocket panel.
 */
export async function createShiprocketOrder(orderParams: {
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  shippingAddress: Address;
  totalAmount: number;
}) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    shiprocketOrderId: `sr_ord_${Math.random().toString(36).substr(2, 9)}`,
    shipmentId: `sr_shp_${Math.random().toString(36).substr(2, 9)}`,
    awbNumber: `SR${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    success: true,
  };
}

/**
 * Simulates generating shipping manifests or labels.
 */
export async function generateShippingManifest(shipmentId: string) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    manifestUrl: `https://shiprocket.co/manifests/mock_${shipmentId}.pdf`,
    success: true,
  };
}

/**
 * Simulates tracking shipment status.
 */
export async function trackShiprocketShipment(trackingNumber: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const stages = [
    { status: "AWB Generated", location: "Ambala Warehouse", time: "2026-06-28 10:00 AM" },
    { status: "Package Picked Up", location: "Ambala Hub", time: "2026-06-28 02:00 PM" },
    { status: "In Transit", location: "Delhi Gateway", time: "2026-06-28 11:30 PM" },
    { status: "Out for Delivery", location: "Destination City Hub", time: "N/A" },
    { status: "Delivered", location: "Customer Doorstep", time: "N/A" },
  ];

  // Return realistic mock status based on the tracking number
  const progressIndex = parseInt(trackingNumber.slice(-1)) % 5 || 2;
  return {
    status: stages[progressIndex].status,
    location: stages[progressIndex].location,
    updatedAt: stages[progressIndex].time,
    history: stages.slice(0, progressIndex + 1),
  };
}
