import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";

// GET admin dashboard data (only for admin)
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

    // Get all orders for dashboard
    const allOrders = await db.getAllOrders();
    const allUsers = await db.getAllUsers();
    const allReviews = await db.getAllReviews();
    const allRequests = await db.getAllRequests();
    const allProducts = await db.getAllProducts();

    const stats = {
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((sum, order) => sum + order.amount, 0),
      pendingOrders: allOrders.filter((o) => o.status === "Pending").length,
      completedOrders: allOrders.filter((o) => o.status === "Delivered").length,
      totalUsers: allUsers.filter((candidate) => candidate.role === "customer").length,
      pendingReviews: allReviews.filter((review) => review.status === "Pending").length,
      newRequests: allRequests.filter((request) => request.status === "New").length,
      totalProducts: allProducts.length,
    };

    const recentOrders = allOrders.slice(-10).reverse();

    return NextResponse.json({
      stats,
      recentOrders,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    );
  }
}
