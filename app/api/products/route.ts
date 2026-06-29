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

  // Filter by category
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  // Filter by brand
  if (brand) {
    filtered = filtered.filter(
      (p) => p.brand.toLowerCase() === brand.toLowerCase()
    );
  }

  // Search
  if (search) {
    const q = search.toLowerCase();

    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Featured products
  if (featured === "true") {
    filtered = filtered.filter((p) => p.featured);
  }

  // Sorting
  switch (sort) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;

    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;

    case "newest":
      filtered.sort(
        (a, b) =>
          Number(b.newArrival) - Number(a.newArrival)
      );
      break;

    default:
      break;
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    products: filtered,
  });
}