import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";
import type { OrderStatus } from "@/types/commerce";

// GET all orders (admin only)
export async function GET(req: Request) {
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

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    const orders = await db.getAllOrders(page, limit);
    const total = await db.getOrdersCount();
    
    return NextResponse.json({ 
      orders, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit) 
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
