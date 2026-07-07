import { NextResponse } from "next/server";
import { db } from "@/lib/db/memory";
import { comparePassword, hashPassword, signToken, setAuthCookie, validateEmail } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const isConfiguredAdmin = adminEmail && adminPassword && email === adminEmail && password === adminPassword;

    let user = db.getUserByEmail(email);
    if (isConfiguredAdmin && !user) {
      user = db.createUser({
        email,
        password: await hashPassword(password),
        firstName: "Raghav",
        lastName: "Admin",
        phone: process.env.ADMIN_PHONE || "9999999999",
        role: "admin",
      });
      db.createCart(user.id);
    } else if (isConfiguredAdmin && user && user.role !== "admin") {
      user = db.updateUser(user.id, { role: "admin" }) || user;
    }

    // Find user
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.password || !(await comparePassword(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json(
      {
        message: "Logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
