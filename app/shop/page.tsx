"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ArrowUpDown, Grid, List, RefreshCw } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { BRANDS } from "@/data/brands";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

function ShopContent() {
  const searchParams = useSearchParams();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync params from URL
  useEffect(() => {
    const catParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    const filterParam = searchParams.get("filter");

    if (catParam) setSelectedCategory(catParam);
    if (brandParam) setSelectedBrand(brandParam);
    if (filterParam === "deals") {
      // Set to high discount filter indirectly
      setPriceRange(2000);
    }
  }, [searchParams]);

  // Reset Filters
  const handleReset = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange(3000);
    setSelectedRating(null);
    setSortOption("featured");
  };

  // Filter & Sort Logic
  const filteredProducts = PRODUCTS.filter((prod) => {
    // Category filter
    if (selectedCategory && prod.category !== selectedCategory) return false;
    // Brand filter
    if (selectedBrand && prod.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
    // Price filter
    if (prod.price > priceRange) return false;
    // Rating filter
    if (selectedRating && prod.rating < selectedRating) return false;

    // Search query parameter
    const searchVal = searchParams.get("q");
    if (searchVal) {
      const q = searchVal.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchBrand = prod.brand.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchBrand) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    if (sortOption === "rating") return b.rating - a.rating;
    // Featured (default)
    return b.featured === a.featured ? 0 : b.featured ? 1 : -1;
  });

  return (
    <section className="page-shell">
      <div className="container">
      {/* Search status / title */}
      <div className="page-header">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          {searchParams.get("q")
            ? `Search Results for "${searchParams.get("q")}"`
            : "Explore Premium Accessories"}
        </h1>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Showing {filteredProducts.length} premium items
        </p>
      </div>

      <div className="grid gap-8 xl:gap-10 xl:grid-cols-[300px_minmax(0,1fr)]">
        {/* Sidebar Filters */}
        <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-6 shadow-sm xl:sticky xl:top-28">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
              <SlidersHorizontal size={16} className="text-orange-500" />
              Filters
            </h2>
            <button
              onClick={handleReset}
              className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition"
            >
              <RefreshCw size={12} />
              Reset All
            </button>
          </div>

          {/* Categories Filter */}
          <div className="mb-6">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-xl transition ${
                  selectedCategory === ""
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>All Categories</span>
                <span>{PRODUCTS.length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = PRODUCTS.filter((p) => p.category === cat.slug).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-xl transition ${
                      selectedCategory === cat.slug
                        ? "bg-orange-50 text-orange-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="mb-6">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              Brands
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedBrand("")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                  selectedBrand === ""
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-slate-200 hover:border-slate-350 text-slate-600"
                }`}
              >
                All
              </button>
              {BRANDS.map((br) => (
                <button
                  key={br.id}
                  onClick={() => setSelectedBrand(br.name)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                    selectedBrand.toLowerCase() === br.name.toLowerCase()
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-slate-200 hover:border-slate-350 text-slate-600"
                  }`}
                >
                  {br.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              Max Price: ₹{priceRange}
            </h3>
            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
              <span>₹200</span>
              <span>₹3,000</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              Rating
            </h3>
            <div className="flex flex-col gap-2">
              {[4.5, 4.0, 3.5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition ${
                    selectedRating === rating
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>⭐ {rating} & Above</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grids */}
        <div className="min-w-0">
          {/* Controls Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            {/* Sorting */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <ArrowUpDown size={14} />
                Sort By:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-orange-500"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-slate-200 rounded-xl overflow-hidden p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid" ? "bg-orange-500 text-white" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "list" ? "bg-orange-500 text-white" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>

          {/* Catalog Lists */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.35 }}
                className={
                  viewMode === "grid"
                    ? "grid gap-6 md:grid-cols-2 2xl:grid-cols-3"
                    : "flex flex-col gap-4"
                }
              >
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <SlidersHorizontal size={48} className="text-slate-300 mb-4 stroke-1" />
                <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  We couldn't find any accessories matching your exact filters. Try adjusting your sliders or categories.
                </p>
                <Button onClick={handleReset} variant="primary" className="mt-6 rounded-2xl">
                  Reset All Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </section>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
