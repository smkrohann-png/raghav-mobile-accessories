"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {/* Big 404 */}
          <div className="relative mb-6">
            <h1 className="text-[120px] font-black text-slate-100 leading-none select-none md:text-[180px]">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-3xl bg-orange-500/10 border border-orange-200 px-6 py-3">
                <span className="text-orange-600 font-black text-sm">Page Not Found</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-3">Oops! Wrong Turn</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed mb-8">
            The page you're looking for doesn't exist or has been moved. Head back to shop for premium mobile accessories.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition"
            >
              <Home size={16} />
              Go Home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600 transition"
            >
              <Search size={16} />
              Browse Shop
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Links</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: "Chargers", href: "/shop?category=chargers" },
                { label: "Phone Cases", href: "/shop?category=cases" },
                { label: "Earbuds", href: "/shop?category=earbuds" },
                { label: "Power Banks", href: "/shop?category=power-banks" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
