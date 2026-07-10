import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";

// GET order details
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const order = await db.getOrderById(id);

    if (!order || order.customer !== session.userId) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// CANCEL order
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const order = await db.getOrderById(id);

    if (!order || order.customer !== session.userId) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    if (["Shipped", "Delivered", "Cancelled"].includes(order.status)) {
      return NextResponse.json(
        { error: "Cannot cancel this order" },
        { status: 400 }
      );
    }

    const updated = await db.updateOrder(id, {
          status: "Cancelled",
          messages: [
            ...order.messages,
            {
              status: "Cancelled",
              text: "Order cancelled by customer",
              time: new Date().toISOString(),
            },
          ],
        });

    return NextResponse.json({
      message: "Order cancelled successfully",
      order: updated,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
