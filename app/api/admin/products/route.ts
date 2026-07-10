import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db/memory";
import type { Product } from "@/types/product";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  return NextResponse.json({ products: await db.getAllProducts() });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await req.json();
  const product = await db.createProduct(normalizeProduct(body));
  return NextResponse.json({ product }, { status: 201 });
}

function normalizeProduct(body: Partial<Product>): Omit<Product, "id"> & { id?: string } {
  const stock = Number(body.stock ?? 0);
  return {
    id: body.id,
    name: String(body.name || "New product").trim(),
    category: String(body.category || "Data Cables").trim(),
    tag: String(body.tag || "New").trim(),
    price: Number(body.price || 0),
    compareAt: body.compareAt ? Number(body.compareAt) : undefined,
    image: body.image || undefined,
    sku: body.sku || undefined,
    connector: body.connector || undefined,
    power: body.power || undefined,
    length: body.length || undefined,
    rating: Number(body.rating || 4.5),
    reviews: Number(body.reviews || 0),
    stock,
    availability: stock <= 0 ? "Pre-order" : stock <= 10 ? "Low stock" : "In stock",
    compatibleBrands: Array.isArray(body.compatibleBrands) ? body.compatibleBrands : String(body.compatibleBrands || "All").split(",").map((item) => item.trim()).filter(Boolean),
    color: String(body.color || "White"),
    tone: body.tone || "orange",
    visual: body.visual || "cable",
    description: String(body.description || "Mobile accessory product.").trim(),
    features: Array.isArray(body.features) ? body.features : String(body.features || "").split("\n").map((item) => item.trim()).filter(Boolean),
  };
}
