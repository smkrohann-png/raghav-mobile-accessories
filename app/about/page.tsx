"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/constants/site";
import { ShieldCheck, Star, Truck, Heart, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "Premium Products", value: "500+" },
    { label: "Happy Customers", value: "10,000+" },
    { label: "Average Rating", value: "4.9 ★" },
    { label: "Cities Delivered", value: "500+" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "100% Authentic",
      desc: "Every product sold on Raghav Mobile Accessories is original and sourced directly from brand-authorized distributors. No counterfeits.",
    },
    {
      icon: Truck,
      title: "Pan India Delivery",
      desc: "We deliver to 500+ cities across India using Shiprocket's trusted logistics network. Express shipping available in metro cities.",
    },
    {
      icon: Heart,
      title: "Customer First",
      desc: "We prioritize customer satisfaction above everything else. Easy returns, fast refunds, and 24/7 WhatsApp support.",
    },
    {
      icon: Star,
      title: "Curated Quality",
      desc: "Every product goes through a quality check before dispatch. From Spigen cases to boAt earbuds — only the best makes it to your cart.",
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-transparent" />
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400 uppercase tracking-widest mb-5">
              Est. 2018 · Ambala, Haryana
            </span>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl mb-5 leading-tight">
              India's Premium Mobile
              <span className="block text-orange-500">Accessories Store</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed font-medium">
              Raghav Mobile Accessories was founded with one mission — to make premium mobile protection and audio experiences accessible to every Indian at honest prices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-b border-slate-100 py-10">
        <div className="container grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <h2 className="text-3xl font-black text-orange-500">{s.value}</h2>
              <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="section bg-slate-50/50">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3 block">Our Story</span>
              <h2 className="text-3xl font-black text-slate-900 mb-5 leading-tight">
                Started From a Small Shop,<br />Now Serving All of India
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Raghav Mobile Accessories started in 2018 as a small retail shop in Ambala, Haryana. With a passion for mobile technology and a vision to provide genuine accessories at fair prices, we started stocking Spigen cases, Ambrane power banks, and Noise earbuds for local customers.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Today, we've grown into a nationwide e-commerce store trusted by over 10,000 customers. We carry 500+ products across 6 categories — from tempered glass to 65W fast chargers — and ship pan-India within 24 hours.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition"
              >
                Shop Our Collection
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=400&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80",
              ].map((img, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden ${i === 1 ? "mt-6" : i === 2 ? "-mt-6" : ""}`}>
                  <img src={img} alt="Store product" className="w-full h-44 object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Our Core Values</h2>
            <div className="mt-3 h-1 w-12 rounded-full bg-orange-500 mx-auto" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-slate-100 bg-slate-50/50 p-7 hover:shadow-md hover:bg-white hover:border-orange-200 transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 mb-4">
                  <v.icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA strip */}
      <section className="bg-slate-950 py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-xl font-black">Have Questions? We're Here.</h3>
            <p className="text-xs text-slate-400 mt-1">Reach out via WhatsApp, email, or visit our store in Ambala.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold">
            <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition">
              <Mail size={15} className="text-orange-500" />
              {SITE_CONFIG.email}
            </a>
            <a href={`tel:${SITE_CONFIG.phone}`} className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition">
              <Phone size={15} className="text-orange-500" />
              {SITE_CONFIG.phone}
            </a>
            <span className="flex items-center gap-2 text-slate-300">
              <MapPin size={15} className="text-orange-500" />
              {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
