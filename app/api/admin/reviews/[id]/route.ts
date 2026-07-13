import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db/memory";

export async function PATCH(req: Request, context: RouteContext<"/api/admin/reviews/[id]">) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const { status } = await req.json();
  if (!["Approved", "Pending", "Rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid review status" }, { status: 400 });
  }
  const review = await db.updateReview(id, { status });
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  return NextResponse.json({ review });
}

export async function DELETE(req: Request, context: RouteContext<"/api/admin/reviews/[id]">) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const deleted = await db.deleteReview(id);
  if (!deleted) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
