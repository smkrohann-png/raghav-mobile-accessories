"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Star, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, hasItem } = useWishlistStore();
  const wishlisted = hasItem(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, selectedColor);
    router.push("/checkout");
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg"
      >
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-500 hover:border-orange-500 hover:text-orange-500 transition-colors"
        >
          <Heart
            size={16}
            fill={wishlisted ? "#ff6b00" : "transparent"}
            className={wishlisted ? "text-orange-500" : "text-slate-500"}
          />
        </button>

        {/* Discount Badge */}
        {product.discount && (
          <Badge
            variant="danger"
            size="sm"
            className="absolute left-6 top-6 z-10 font-bold"
          >
            -{product.discount}% OFF
          </Badge>
        )}

        {/* Product Image Wrapper */}
        <Link
          href={`/product/${product.id}`}
          className="relative mb-5 flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-slate-50"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="max-h-44 max-w-[82%] object-contain transition-transform duration-500 group-hover:scale-110"
          />

          {/* Quick View Hover Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleQuickView}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md hover:bg-orange-500 hover:text-white transition"
            >
              <Eye size={18} />
            </button>
          </div>
        </Link>

        {/* Product Category & Brand */}
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>{product.category}</span>
          <span>{product.brand}</span>
        </div>

        {/* Product Title */}
        <Link
          href={`/product/${product.id}`}
          className="mb-3 min-h-[3.25rem] text-base font-bold leading-6 text-slate-800 transition hover:text-orange-500 line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mb-4 flex items-center gap-1">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                className={i < Math.floor(product.rating) ? "text-amber-400" : "text-slate-200"}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        {/* Price & Cart CTA */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black leading-none text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] font-semibold text-emerald-600">Free Shipping</p>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              added
                ? "bg-emerald-500 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            } shadow-md`}
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <Modal
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        title="Quick View Product"
        size="lg"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="flex items-center justify-center bg-slate-50 rounded-2xl p-6">
            <img
              src={product.images[0]}
              alt={product.name}
              className="max-h-60 object-contain"
            />
          </div>

          {/* Details Column */}
          <div className="flex flex-col">
            <Badge variant="primary" size="sm" className="w-fit mb-2">
              {product.brand}
            </Badge>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {product.name}
            </h3>

            {/* Quick Price */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Color Chooser */}
            {product.colors.length > 0 && (
              <div className="mb-5">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Select Color: {selectedColor}
                </span>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition ${
                        selectedColor === color
                          ? "border-orange-500 bg-orange-50 text-orange-600"
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                variant={added ? "secondary" : "primary"}
                className="flex-1 rounded-2xl"
                leftIcon={added ? <Check size={18} /> : <ShoppingCart size={18} />}
              >
                {added ? "Added to Cart" : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="flex-1 rounded-2xl"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
