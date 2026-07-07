import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    const token = req.cookies.get("auth-token")?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin") return NextResponse.next();
    const token = req.cookies.get("auth-token")?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/profile") || pathname.startsWith("/orders")) {
    const token = req.cookies.get("auth-token")?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/profile/:path*", "/orders/:path*"],
};
