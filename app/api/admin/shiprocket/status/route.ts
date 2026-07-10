import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";
import { isShiprocketConfigured } from "@/lib/shipping";

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

    return NextResponse.json({
      configured: isShiprocketConfigured(),
      email: process.env.SHIPROCKET_EMAIL || "",
      pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || "",
    });
  } catch (error) {
    console.error("Fetch shiprocket status error:", error);
    return NextResponse.json({ error: "Failed to fetch shiprocket status" }, { status: 500 });
  }
}
