"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

import { ProductCard } from "@/components/storefront/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { categories, products } from "@/data/storefront";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("All");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const textMatch =
        !normalized ||
        [product.name, product.category, product.description, product.color, ...product.features]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return categoryMatch && textMatch;
    });
  }, [category, query]);

  return (
    <Section muted>
      <Container>
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <Badge>Premium search</Badge>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-14 pl-12 text-base"
                placeholder="Search cases, chargers, earbuds, glass..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {['All', ...categories.map((item) => item.name)].map((item) => (
                <button
                  className={`h-12 rounded-full border px-4 text-sm font-bold transition ${category === item ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50"}`}
                  key={item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>{results.length} matching accessories</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <span>Filter architecture ready for backend search.</span>
          </div>
        </div>
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        {results.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xl font-black text-slate-950">No accessories found.</p>
            <p className="mt-2 text-sm text-slate-600">Try a broader query or switch categories.</p>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
