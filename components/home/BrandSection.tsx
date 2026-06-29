"use client";

import { motion } from "framer-motion";
import { BRANDS } from "@/data/brands";
import SectionTitle from "@/components/common/SectionTitle";

export default function BrandSection() {
  return (
    <section className="section bg-slate-50/50">
      <div className="container">
        <SectionTitle
          title="Featured Brands"
          subtitle="We partner with the world's most trusted manufacturers to bring you original, high-quality mobile accessories."
        />

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
          {BRANDS.map((brand, idx) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex h-24 items-center justify-center rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all select-none"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
