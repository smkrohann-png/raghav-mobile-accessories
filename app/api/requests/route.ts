import { NextResponse } from "next/server";

import { db, type AdminRequestKind } from "@/lib/db/memory";
import { storeInfo } from "@/lib/store-info";

export async function POST(req: Request) {
  const body = await req.json();
  const kind = (body.kind || "contact") as AdminRequestKind;
  const request = db.createRequest({
    kind,
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim(),
    phone: String(body.phone || "").trim(),
    subject: String(body.subject || (kind === "repair" ? "Repair request" : "Customer message")),
    message: String(body.message || "").trim(),
    meta: body.meta || {},
  });

  console.log(`Admin email notification queued for ${storeInfo.email}: ${request.kind} ${request.id}`);
  return NextResponse.json({ request, notificationEmail: storeInfo.email }, { status: 201 });
}
