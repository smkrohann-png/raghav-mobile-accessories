"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/products";
import SectionTitle from "@/components/common/SectionTitle";

export default function Testimonials() {
  return (
    <section className="section bg-slate-50/50">
      <div className="container">
        <SectionTitle
          title="Customer Testimonials"
          subtitle="What our happy customers say about our premium accessories and fast shipping services."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ y: -6 }}
              className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex flex-col"
            >
              <Quote
                size={40}
                className="absolute right-8 top-8 text-orange-500/10 pointer-events-none"
              />

              {/* Star Rating */}
              <div className="flex text-amber-400 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" className="text-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-xs font-semibold leading-relaxed text-slate-600 mb-6 flex-grow">
                "{t.content}"
              </p>

              {/* Customer Avatar & Bio */}
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover border border-slate-100"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-800">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
