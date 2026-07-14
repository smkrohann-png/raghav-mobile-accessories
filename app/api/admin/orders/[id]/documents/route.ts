import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";
import { getShiprocketLabel, getShiprocketInvoice } from "@/lib/shipping";

export async function GET(
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
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 });
    }

    const { id } = await params;
    const url = new URL(req.url);
    const type = url.searchParams.get("type"); // 'label' or 'invoice'

    const order = await db.getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.shiprocketOrderId) {
      return NextResponse.json(
        { error: "Order is not shipped via Shiprocket yet" },
        { status: 400 }
      );
    }

    let downloadUrl = "";

    if (type === "label") {
      if (!order.shiprocketShipmentId) {
        return NextResponse.json(
          { error: "Shipment ID not found for this order" },
          { status: 400 }
        );
      }
      downloadUrl = await getShiprocketLabel(order.shiprocketShipmentId);
    } else if (type === "invoice") {
      downloadUrl = await getShiprocketInvoice(order.shiprocketOrderId);
    } else {
      return NextResponse.json(
        { error: "Invalid document type. Must be 'label' or 'invoice'" },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: downloadUrl });
  } catch (error: any) {
    console.error("Document download error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate document" },
      { status: 500 }
    );
  }
}
