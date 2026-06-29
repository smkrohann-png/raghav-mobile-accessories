import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Simulate Razorpay order creation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", notes } = body as {
      amount: number;
      currency?: string;
      notes?: Record<string, string>;
    };

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Simulated Razorpay order object
    const orderId = `order_${crypto.randomBytes(8).toString("hex")}`;

    const razorpayOrder = {
      id: orderId,
      entity: "order",
      amount: amount * 100, // paisa
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      status: "created",
      notes: notes ?? {},
      created_at: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json({ success: true, order: razorpayOrder }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
  }
}
