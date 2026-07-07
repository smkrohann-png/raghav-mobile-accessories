"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";

import { ProductCard } from "@/components/storefront/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { categories, products } from "@/data/storefront";

const allOption = "All";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allOption);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    return products.filter((product) => {
      const searchMatch =
        !search ||
        [
          product.name,
          product.category,
          product.color,
          product.description,
          product.availability,
          product.sku,
          product.connector,
          product.power,
          product.length,
          ...product.compatibleBrands,
          ...product.features,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

      const categoryMatch = category === allOption || product.category === category;

      return searchMatch && categoryMatch;
    });
  }, [category, query]);

  const resetFilters = () => {
    setQuery("");
    setCategory(allOption);
  };

  return (
    <Section muted className="pt-10">
      <Container>
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge>Products</Badge>
              <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">Raghav Mobile Accessories</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Browse Arbanix cables with category, connector, power, stock and price filters. The same product fields are ready for future admin product entry.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
              {filteredProducts.length} products found
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block w-full sm:w-[420px] lg:w-[520px]">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  className="h-14 pl-12 text-base"
                  placeholder="Search products..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <Button type="button" variant="secondary" onClick={resetFilters} className="h-14 rounded-xl">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 xl:justify-end">
            <button
              type="button"
              onClick={() => setCategory(allOption)}
              className={`h-10 rounded-full px-4 text-sm font-bold transition ${category === allOption ? "bg-orange-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-orange-50"}`}
            >
              All
            </button>
            {categories.map((item) => (
              <button
                type="button"
                key={item.slug}
                onClick={() => setCategory(item.name)}
                className={`h-10 rounded-full px-4 text-sm font-bold transition ${category === item.name ? "bg-orange-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-orange-50"}`}
              >
                {item.name}
              </button>
            ))}
            </div>
          </div>
        </div>
        {filteredProducts.length ? (
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-black text-slate-950">No matching products</p>
            <p className="mt-2 text-sm text-slate-600">Try another category, connector or search term.</p>
          </div>
        )}
      </Container>
    </Section>
  );
}
