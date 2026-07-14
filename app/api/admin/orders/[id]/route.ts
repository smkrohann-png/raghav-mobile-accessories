import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";
import { cancelShiprocketOrder, isShiprocketConfigured } from "@/lib/shipping";
import type { OrderStatus } from "@/types/commerce";

// UPDATE order status (admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await db.getUserById(session.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin only" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { status, message, paymentStatus } = body;

    const validStatuses: OrderStatus[] = [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const order = await db.getOrderById(id);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // If cancelling a shipped order, also cancel on Shiprocket
    let shiprocketCancelled = false;
    if (status === "Cancelled" && order.shiprocketOrderId && isShiprocketConfigured()) {
      try {
        await cancelShiprocketOrder(order.shiprocketOrderId);
        shiprocketCancelled = true;
      } catch (err: any) {
        console.error("Shiprocket cancel error:", err?.message);
        // Continue with local cancellation even if Shiprocket fails
      }
    }

    const cancelMessage = status === "Cancelled"
      ? `Order cancelled by admin.${shiprocketCancelled ? " Shiprocket shipment also cancelled." : ""}`
      : message || `Order status updated to ${status}`;

    const updated = await db.updateOrder(id, {
          status,
          ...(paymentStatus ? { paymentStatus } : {}),
          messages: [
            ...order.messages,
            {
              status,
              text: cancelMessage,
              time: new Date().toISOString(),
            },
          ],
        });

    return NextResponse.json({
      message: "Order status updated",
      order: updated,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
