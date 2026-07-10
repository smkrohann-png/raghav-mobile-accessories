import { NextResponse } from "next/server";

import { db } from "@/lib/db/memory";

export async function GET() {
  const allReviews = await db.getAllReviews();
  const reviews = allReviews.filter((review) => review.status === "Approved");
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  const body = await req.json();
  const review = await db.createReview({
      name: String(body.name || "").trim(),
      product: String(body.product || "").trim(),
      rating: Number(body.rating || 5),
      text: String(body.text || "").trim(),
    });
  return NextResponse.json({ review, message: "Review submitted for approval" }, { status: 201 });
}
