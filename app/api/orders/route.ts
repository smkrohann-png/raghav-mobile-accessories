import { NextRequest, NextResponse } from "next/server";
import { getStoredOrders, saveStoredOrder } from "@/services/mock-db";
import { Order } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const orders = getStoredOrders();
  const filtered = userId ? orders.filter((o: Order) => o.userId === userId) : orders;

  return NextResponse.json({ orders: filtered, total: filtered.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order } = body as { order: Order };

    if (!order || !order.id || !order.items || !order.total) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    saveStoredOrder(order);

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}
