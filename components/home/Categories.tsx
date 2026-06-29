"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/data/categories";
import SectionTitle from "@/components/common/SectionTitle";
import * as Icons from "lucide-react";

export default function Categories() {
  return (
    <section className="section bg-white">
      <div className="container">
        <SectionTitle
          title="Shop by Category"
          subtitle="Explore our curated collection of premium accessories designed to elevate your mobile lifestyle."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, idx) => {
            // Dynamically select Lucide icon
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group relative h-80 overflow-hidden rounded-3xl bg-slate-900 shadow-md"
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:opacity-40"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/90 text-white shadow-lg backdrop-blur-md transition-all group-hover:bg-orange-500 group-hover:scale-110">
                    <IconComponent size={22} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-orange-400 group-hover:text-orange-300 uppercase"
                  >
                    Explore Items
                    <Icons.ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
