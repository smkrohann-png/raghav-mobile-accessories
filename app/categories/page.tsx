"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import SectionTitle from "@/components/common/SectionTitle";
import * as Icons from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="container py-12">
      <SectionTitle
        title="Product Categories"
        subtitle="Explore our specialized collections. Find the exact fit, power wattage, or audio specs for your devices."
      />

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat, idx) => {
          const itemCount = PRODUCTS.filter((p) => p.category === cat.slug).length;

          // Dynamically map Lucide icons
          let IconComponent = Icons.Smartphone;
          if (cat.slug === "chargers") IconComponent = Icons.Zap;
          if (cat.slug === "earbuds") IconComponent = Icons.Headphones;
          if (cat.slug === "power-banks") IconComponent = Icons.BatteryCharging;
          if (cat.slug === "cables") IconComponent = Icons.Cable;
          if (cat.slug === "tempered-glass") IconComponent = Icons.Shield;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all"
            >
              {/* Category Image Cover */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-6 flex items-center gap-2 text-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/90 text-white shadow-md">
                    <IconComponent size={18} />
                  </div>
                  <span className="text-xs font-bold tracking-wider uppercase bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    {itemCount} Accessories
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6">
                <h3 className="text-lg font-black text-slate-800 mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  {cat.description || "Premium mobile accessories crafted for superior protection, speed, and reliability."}
                </p>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-orange-500 hover:text-orange-600 uppercase"
                >
                  Explore Collection
                  <Icons.ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
