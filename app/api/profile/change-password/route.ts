import { NextResponse } from "next/server";
import { getSessionFromCookies, hashPassword, validatePassword } from "@/lib/auth";
import { db } from "@/lib/db/memory";

// CHANGE password
export async function POST(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both passwords required" },
        { status: 400 }
      );
    }

    const user = db.getUserById(session.userId);
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const encoder = new TextEncoder();
    const data = encoder.encode(currentPassword);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedCurrentPassword = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    if (hashedCurrentPassword !== user.password) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Validate new password
    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Password requirements not met", details: validation.errors },
        { status: 400 }
      );
    }

    // Hash and update
    const hashedNewPassword = await hashPassword(newPassword);
    db.updateUser(session.userId, { password: hashedNewPassword });

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
