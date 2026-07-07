import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db/memory";

export async function PATCH(req: Request, context: RouteContext<"/api/admin/requests/[id]">) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const { status } = await req.json();
  if (!["New", "In Progress", "Closed"].includes(status)) {
    return NextResponse.json({ error: "Invalid request status" }, { status: 400 });
  }
  const request = db.updateRequest(id, { status });
  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  return NextResponse.json({ request });
}
