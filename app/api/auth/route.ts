import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const MOCK_USERS = [
  {
    id: "user_1",
    name: "Raghav Sharma",
    email: "admin@raghavmobile.com",
    password: "admin123",
    role: "admin" as const,
    phone: "+91 98765 43210",
    avatar: null,
  },
  {
    id: "user_demo",
    name: "Demo Customer",
    email: "demo@example.com",
    password: "demo123",
    role: "customer" as const,
    phone: "+91 90000 00001",
    avatar: null,
  },
];

function generateToken(userId: string): string {
  return `mock_jwt_${userId}_${crypto.randomBytes(12).toString("hex")}`;
}

export async function POST(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const body = await req.json();

    // Login
    if (pathname.endsWith("/login")) {
      const { email, password } = body as { email: string; password: string };

      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const { password: _, ...safeUser } = user;
      const token = generateToken(user.id);

      return NextResponse.json({
        success: true,
        token,
        user: safeUser,
      });
    }

    // Register
    if (pathname.endsWith("/register")) {
      const { name, email, phone, password } = body as {
        name: string;
        email: string;
        phone: string;
        password: string;
      };

      if (!name || !email || !password) {
        return NextResponse.json(
          { error: "Name, email, and password are required" },
          { status: 400 }
        );
      }

      if (MOCK_USERS.some((u) => u.email === email)) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      const newUser = {
        id: `user_${crypto.randomBytes(6).toString("hex")}`,
        name,
        email,
        phone: phone ?? "",
        role: "customer" as const,
        avatar: null,
      };

      const token = generateToken(newUser.id);

      return NextResponse.json({ success: true, token, user: newUser }, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown auth action" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
