"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import ProductCard from "@/components/product/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = PRODUCTS.filter((p) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const matchedCategories = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
            <Search size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {query ? `Results for "${query}"` : "Search Products"}
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
              {results.length} accessories found
            </p>
          </div>
        </div>
      </div>

      {!query.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={56} className="text-slate-200 mb-5 stroke-1" />
          <h2 className="text-xl font-bold text-slate-700">Start Searching</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
            Type a product name, brand (Spigen, boAt, Noise), or category (covers, chargers) in the search bar above.
          </p>
        </div>
      ) : results.length > 0 ? (
        <>
          {/* Category Suggestions */}
          {matchedCategories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider mb-3">
                Matching Categories
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {matchedCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-100 transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <SlidersHorizontal size={56} className="text-slate-200 mb-5 stroke-1" />
          <h2 className="text-xl font-bold text-slate-700">No results found</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
            We couldn't find any accessories matching "{query}". Try searching for covers, chargers, earbuds, or power banks.
          </p>
          <Link href="/shop">
            <Button variant="primary" className="mt-6 rounded-full">
              Browse All Products
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-80 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
