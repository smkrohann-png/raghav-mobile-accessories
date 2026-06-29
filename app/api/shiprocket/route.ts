import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      order_date,
      pickup_location,
      billing_address,
      shipping_address,
      order_items,
      payment_method,
      sub_total,
      total_discount = 0,
      shipping_charges = 49,
    } = body;

    if (!order_id || !order_items || !shipping_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Simulated Shiprocket shipment
    const shipmentId = `SR${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
    const awbCode = `ARW${Date.now()}`;

    const response = {
      order_id,
      shipment_id: shipmentId,
      status: "NEW",
      status_code: 1,
      onboarding_completed_now: false,
      awb_code: awbCode,
      courier_company_id: 60,
      courier_name: "Delhivery",
      pickup_token_number: `PKT${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      routing_code: "DEL-SFB",
      remarks: "Order created successfully",
      label_url: `https://shiprocket.co/label/${shipmentId}`,
      pickup_scheduled_date: new Date(Date.now() + 86400000).toISOString(),
      pickup_assigned_agent: null,
      invoice: {
        total: sub_total - total_discount + shipping_charges,
        sub_total,
        shipping_charges,
        total_discount,
      },
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, shipment: response }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Shiprocket order creation failed" }, { status: 500 });
  }
}
