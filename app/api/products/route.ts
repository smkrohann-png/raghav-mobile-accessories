import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const search = searchParams.get("q");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort");

  let filtered = [...PRODUCTS];

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (brand) {
    filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (featured === "true") {
    filtered = filtered.filter((p) => p.isFeatured);
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === "newest") {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  return NextResponse.json({
    products: filtered,
    total: filtered.length,
  });
}
