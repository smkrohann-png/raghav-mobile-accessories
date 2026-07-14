import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const order = await db.getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify the order belongs to this customer
    if (order.customer !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Customer can only cancel Pending or Confirmed orders
    if (!["Pending", "Confirmed"].includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot cancel order with status "${order.status}". Only Pending or Confirmed orders can be cancelled.` },
        { status: 400 }
      );
    }

    const updated = await db.updateOrder(id, {
      status: "Cancelled",
      messages: [
        ...order.messages,
        {
          status: "Cancelled",
          text: "Order cancelled by customer.",
          time: new Date().toISOString(),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      order: updated,
    });
  } catch (error: any) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to cancel order" },
      { status: 500 }
    );
  }
}
