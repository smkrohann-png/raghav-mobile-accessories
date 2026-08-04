"use client";

import { useState } from "react";
import { ShoppingBag, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductVisual } from "@/components/storefront/ProductVisual";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/60">
      <div className="relative p-3">
        <ProductVisual product={product} className="rounded-xl transition duration-500 group-hover:scale-[1.015]" />
      </div>
      <div className="flex flex-1 flex-col p-5 pt-2">
        <h3 className="text-lg font-bold text-slate-950">{product.name}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-slate-600">{product.description}</p>
        <div className="mt-5 flex flex-col gap-3">
          <div>
            <p className="text-xl font-bold text-slate-950">{formatCurrency(product.price)}</p>
            {product.compareAt ? <p className="text-sm text-slate-400 line-through">{formatCurrency(product.compareAt)}</p> : null}
          </div>
          <div className="mt-2">
            <AddToCartButton productId={product.id} size="sm" redirectToCart={false} className="w-full rounded-xl !bg-emerald-600 !text-white hover:!bg-emerald-700" />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {quickViewOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative grid w-full max-w-3xl gap-5 overflow-hidden rounded-3xl border border-white/70 bg-white p-4 shadow-2xl sm:grid-cols-[0.9fr_1fr]"
              initial={{ y: 24, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, scale: 0.97 }}
            >
              <button
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-600 shadow"
                onClick={() => setQuickViewOpen(false)}
                aria-label="Close quick view"
              >
                <X className="h-4 w-4" />
              </button>
              <ProductVisual product={product} className="min-h-64 rounded-2xl" />
              <div className="p-2 sm:p-4">
                <Badge>{product.availability}</Badge>
                <h3 className="mt-4 text-3xl font-black text-slate-950">{product.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
                <div className="mt-5 flex items-end gap-3">
                  <span className="text-3xl font-black text-slate-950">{formatCurrency(product.price)}</span>
                  {product.compareAt ? <span className="pb-1 text-sm font-semibold text-slate-400 line-through">{formatCurrency(product.compareAt)}</span> : null}
                </div>
                <div className="mt-5 grid gap-2">
                  {product.features.map((feature) => (
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-700" key={feature}>
                      <Zap className="h-4 w-4 text-emerald-600" />
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button href={`/product/${product.id}`} className="w-full sm:w-auto">Open details</Button>
                  <AddToCartButton productId={product.id} className="w-full sm:w-auto" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}
