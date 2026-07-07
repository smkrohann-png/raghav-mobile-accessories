import { NextResponse } from "next/server";
import { clearAuthCookie, getSessionFromCookies } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Verify user is authenticated
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Clear auth cookie
    await clearAuthCookie();

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
