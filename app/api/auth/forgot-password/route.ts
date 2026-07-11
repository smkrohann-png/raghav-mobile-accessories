import { NextResponse } from "next/server";
import { db } from "@/lib/db/memory";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      // Return success even if user doesn't exist for security (avoid email enumeration)
      return NextResponse.json({ message: "If an account exists, an OTP was sent." });
    }

    // In a real app, send an email via Resend or Nodemailer here.
    // For now, we simulate OTP sending. The valid OTP will be '123456'.
    console.log(`[Simulated] OTP for ${email} is 123456`);

    return NextResponse.json({ message: "OTP sent successfully (Simulated: use 123456)" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
