import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";

// GET all users (admin only)
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

    // Note: In production, implement pagination
    const allOrders = await db.getAllOrders();
    const totalCustomers = new Set(allOrders.map((o) => o.customer)).size;

    return NextResponse.json({
      stats: {
        totalCustomers,
        totalOrders: allOrders.length,
      },
    });
  } catch (error) {
    console.error("Get users stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
