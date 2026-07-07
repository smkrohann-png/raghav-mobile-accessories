import { NextResponse } from "next/server";

import { db } from "@/lib/db/memory";

export async function GET() {
  return NextResponse.json({ products: db.getAllProducts() });
}
