"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw, HeartHandshake } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

export default function WhyChooseUs() {
  const points = [
    {
      icon: Truck,
      title: "Free Fast Shipping",
      description: "Enjoy zero shipping charges on all orders above ₹499. Dispatched within 24 hours across India.",
    },
    {
      icon: ShieldCheck,
      title: "100% Original Gear",
      description: "Every cover, charger, and earbud is sourced directly from brands. Original manufacturer warranty included.",
    },
    {
      icon: RotateCcw,
      title: "7-Day Easy Return",
      description: "Not satisfied with the fit or quality? Return or exchange within 7 days, no questions asked.",
    },
    {
      icon: HeartHandshake,
      title: "Premium Support",
      description: "Get 24/7 dedicated support via WhatsApp and Email for tracking, cancellations, or product queries.",
    },
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <SectionTitle
          title="Why Choose Us"
          subtitle="We are committed to providing you with premium products and a seamless shopping experience."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((pt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-slate-100 bg-slate-50/50 p-8 shadow-sm hover:shadow-md hover:bg-white hover:border-orange-200 transition-all"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <pt.icon size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">
                {pt.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {pt.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
