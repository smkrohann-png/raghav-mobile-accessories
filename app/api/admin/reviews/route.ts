import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db/memory";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  return NextResponse.json({ reviews: db.getAllReviews().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))) });
}
