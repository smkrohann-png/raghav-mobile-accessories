import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await db.getUserById(session.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const coupons = await db.getAllCoupons();
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Fetch coupons error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await db.getUserById(session.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { code, discountType, discountValue, minOrderAmount, isActive } = body;

    if (!code || !discountType || typeof discountValue !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await db.getCouponByCode(code);
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }

    const coupon = await db.createCoupon({
          code: code.toUpperCase(),
          discountType,
          discountValue,
          minOrderAmount: minOrderAmount || 0,
          isActive: isActive ?? true,
        });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    console.error("Create coupon error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
