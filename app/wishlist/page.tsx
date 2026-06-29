"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-24 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Heart size={28} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-800">Your Wishlist is Empty</h2>
        <p className="text-xs font-semibold text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
          Looks like you haven't saved any products to your wishlist yet. Browse our premium store to shortlist your favorites!
        </p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button variant="primary" className="rounded-full">
            Browse Accessories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-baseline justify-between border-b border-slate-100 pb-5 mb-8">
        <h1 className="text-3xl font-black text-slate-900">My Wishlist</h1>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {items.length} shortlisted items
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}
