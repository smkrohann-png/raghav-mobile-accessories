import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db/memory";
import type { Product } from "@/types/product";

export async function PUT(req: Request, context: RouteContext<"/api/admin/products/[id]">) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const existing = await db.getProductById(id);
  if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const body = (await req.json()) as Partial<Product>;
  const stock = Number(body.stock ?? existing.stock);
  const compareAt = body.compareAt === undefined ? existing.compareAt : Number(body.compareAt) || undefined;
  const product = await db.upsertProduct({
      ...existing,
      ...body,
      id,
      price: Number(body.price ?? existing.price),
      compareAt,
      rating: Number(body.rating ?? existing.rating),
      reviews: Number(body.reviews ?? existing.reviews),
      stock,
      availability: stock <= 0 ? "Pre-order" : stock <= 10 ? "Low stock" : "In stock",
      compatibleBrands: Array.isArray(body.compatibleBrands) ? body.compatibleBrands : existing.compatibleBrands,
      features: Array.isArray(body.features) ? body.features : existing.features,
    });

  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, context: RouteContext<"/api/admin/products/[id]">) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await context.params;
  if (!await db.deleteProduct(id)) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ message: "Product deleted" });
}
