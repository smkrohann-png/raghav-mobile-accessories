import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";

export async function requireAdmin() {
  const session = await getSessionFromCookies();
  if (!session) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }

  const user = db.getUserById(session.userId);
  if (!user || user.role !== "admin") {
    return { error: NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 }) };
  }

  return { user };
}
