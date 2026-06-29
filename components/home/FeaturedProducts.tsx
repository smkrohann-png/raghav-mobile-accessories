"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import SectionTitle from "@/components/common/SectionTitle";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

type TabType = "featured" | "bestseller" | "new" | "deals";

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabType>("featured");

  const filteredProducts = PRODUCTS.filter((prod) => {
    if (activeTab === "featured") return prod.featured;
    if (activeTab === "bestseller") return prod.bestSeller;
    if (activeTab === "new") return prod.newArrival;
    if (activeTab === "deals") return prod.discount && prod.discount >= 25;
    return true;
  }).slice(0, 4); // Limit to top 4 products

  const tabs = [
    { id: "featured", label: "Featured" },
    { id: "bestseller", label: "Best Sellers" },
    { id: "new", label: "New Arrivals" },
    { id: "deals", label: "Today's Deals" },
  ];

  return (
    <section className="section bg-slate-50/50">
      <div className="container">
        <SectionTitle
          title="Trending Collection"
          subtitle="Explore our hottest additions and top-selling accessories. Fast delivery across India."
        />

        {/* Tab Selection */}
        <div className="mb-10 flex justify-center">
          <div className="flex gap-1.5 rounded-full border border-slate-100 bg-white p-1.5 shadow-sm">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className="relative px-5 py-2.5 text-xs font-bold transition select-none"
                >
                  {active && (
                    <motion.div
                      layoutId="featured-active"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="absolute inset-0 rounded-full bg-orange-500 shadow-md shadow-orange-500/15"
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      active ? "text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="min-h-[420px]">
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={prod} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* View All CTA */}
        <div className="mt-12 flex justify-center">
          <Link href="/shop">
            <Button
              variant="outline"
              className="rounded-full font-bold shadow-sm"
              rightIcon={<ArrowRight size={16} />}
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
