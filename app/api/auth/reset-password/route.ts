import { NextResponse } from "next/server";
import { db } from "@/lib/db/memory";
import { verifyToken, hashPassword, validatePassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { resetToken, password } = await req.json();
    if (!resetToken || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payload = await verifyToken(resetToken);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: "Password requirements not met", details: passwordValidation.errors },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    await db.updateUser(payload.userId, { password: hashedPassword });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
