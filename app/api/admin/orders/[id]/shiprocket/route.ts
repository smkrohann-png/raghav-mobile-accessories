import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";
import { createShiprocketOrder, isShiprocketConfigured } from "@/lib/shipping";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await db.getUserById(session.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const order = await db.getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Group order products to calculate units for Shiprocket
    const groupedItems: { [id: string]: { name: string; sku: string; price: number; qty: number } } = {};
    for (const p of order.products) {
      if (!groupedItems[p.id]) {
        groupedItems[p.id] = {
          name: p.name,
          sku: p.sku || p.id,
          price: p.price,
          qty: 0,
        };
      }
      groupedItems[p.id].qty += 1;
    }

    const shiprocketItems = Object.values(groupedItems).map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.qty,
      selling_price: item.price,
    }));

    let result;
    const configured = isShiprocketConfigured();

    if (configured) {
      // Call actual Shiprocket API
      result = await createShiprocketOrder({
        order,
        items: shiprocketItems,
        billingCustomerName: order.customerName || "Customer",
        billingEmail: order.customerEmail || "customer@example.com",
        billingPhone: order.phone,
        billingAddress: order.address,
        billingCity: "Yamunanagar", // fallback or parsed from address
        billingState: "Haryana",    // fallback or parsed from address
        billingPincode: "135001",   // fallback or parsed from address
      });
    } else {
      // Simulation mode
      const mockAwb = "SR" + Math.floor(1000000000 + Math.random() * 9000000000);
      const mockShipmentId = String(Math.floor(10000000 + Math.random() * 90000000));
      result = {
        configured: false,
        simulated: true,
        orderId: "SR_ORDER_" + order.id.replace("order_", ""),
        shipmentId: mockShipmentId,
        awbCode: mockAwb,
      };
    }

    // Update order with shipping info
    const updated = await db.updateOrder(id, {
          status: "Shipped",
          shippingProvider: "Shiprocket",
          shippingStatus: "Booked",
          shiprocketAwbCode: result.awbCode,
          shiprocketShipmentId: result.shipmentId,
          shiprocketOrderId: result.orderId,
          messages: [
            ...order.messages,
            {
              status: "Shipped",
              text: `Shipment booked with Shiprocket. AWB: ${result.awbCode}. courier ready for dispatch.`,
              time: new Date().toISOString(),
            },
          ],
        });

    return NextResponse.json({
      success: true,
      message: configured
        ? "Order successfully shipped via Shiprocket"
        : "Order shipped (Simulation Mode - Shiprocket not configured)",
      order: updated,
    });
  } catch (error: any) {
    console.error("Shiprocket error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to ship order" },
      { status: 500 }
    );
  }
}
