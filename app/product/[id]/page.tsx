"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingCart,
  Shield,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Info,
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { formatPrice, formatDate } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProductCard from "@/components/product/ProductCard";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { id } = use(params);

  // Find product
  const product = PRODUCTS.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [added, setAdded] = useState(false);

  // Stores
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, hasItem } = useWishlistStore();

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-black text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 mt-2">The accessory you're looking for does not exist or has been removed.</p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button variant="primary" className="rounded-full">
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const wishlisted = hasItem(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedColor);
    router.push("/checkout");
  };

  // Find related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-orange-500 transition">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-orange-500 transition">Shop</Link>
        <ChevronRight size={12} />
        <Link href={`/shop?category=${product.category}`} className="hover:text-orange-500 transition">
          {product.category}
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 max-w-[200px] truncate">{product.name}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 mb-16">
        {/* Left: Gallery Column */}
        <div>
          <div className="bg-slate-50 rounded-3xl p-8 flex items-center justify-center h-[420px] mb-4 border border-slate-100 overflow-hidden relative">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={product.images[activeImage]}
              alt={product.name}
              className="max-h-72 object-contain"
            />
            {product.discount && (
              <Badge variant="danger" className="absolute left-6 top-6 font-bold">
                {product.discount}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-1 bg-slate-50 border rounded-2xl p-3 flex items-center justify-center h-20 transition ${
                    activeImage === i ? "border-orange-500 ring-2 ring-orange-500/10" : "border-slate-200 hover:border-slate-350"
                  }`}
                >
                  <img src={img} alt="Product Thumbnail" className="max-h-12 object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info Column */}
        <div className="flex flex-col">
          {/* Brand & Stock */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="primary" size="md" className="font-bold">
              {product.brand}
            </Badge>
            {product.stock > 0 ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                In Stock ({product.stock} left)
              </span>
            ) : (
              <span className="text-xs font-semibold text-red-500">Out of Stock</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black text-slate-900 md:text-3xl leading-snug mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  className={i < Math.floor(product.rating) ? "text-amber-400" : "text-slate-200"}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-600">
              {product.rating} / 5 ({product.reviewsCount} customer reviews)
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-3xl font-black text-slate-900">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm font-semibold text-slate-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="ml-auto text-xs font-bold text-emerald-600 uppercase">
              Free Delivery Across India
            </span>
          </div>

          {/* Colors Chooser */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Choose Color: <span className="text-orange-500 font-extrabold">{selectedColor}</span>
              </span>
              <div className="flex gap-2">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold border transition ${
                      selectedColor === col
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-slate-200 hover:border-slate-300 text-slate-650"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-8 flex items-center gap-4">
            <span className="text-xs font-bold text-slate-700">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-10 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 hover:bg-slate-50 text-slate-500 transition font-bold"
              >
                -
              </button>
              <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3.5 hover:bg-slate-50 text-slate-500 transition font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={handleAddToCart}
              variant={added ? "secondary" : "primary"}
              className="flex-1 rounded-2xl h-12"
              leftIcon={added ? <Check size={18} /> : <ShoppingCart size={18} />}
            >
              {added ? "Added to Cart" : "Add to Cart"}
            </Button>
            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="flex-1 rounded-2xl h-12"
            >
              Buy It Now
            </Button>
            <button
              onClick={() => toggleItem(product)}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                wishlisted ? "border-red-200 bg-red-50 text-red-500" : "border-slate-200 hover:border-orange-500 text-slate-500 hover:text-orange-500"
              }`}
            >
              <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
              <Shield className="text-orange-500 flex-shrink-0" size={16} />
              <span>Original Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
              <Truck className="text-orange-500 flex-shrink-0" size={16} />
              <span>Free Express Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
              <RotateCcw className="text-orange-500 flex-shrink-0" size={16} />
              <span>7-Day Replacements</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="border-t border-slate-100 pt-10 mb-16">
        <div className="flex border-b border-slate-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab("desc")}
            className={`pb-3 text-sm font-bold border-b-2 transition select-none ${
              activeTab === "desc" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400 hover:text-slate-800"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 text-sm font-bold border-b-2 transition select-none ${
              activeTab === "specs" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400 hover:text-slate-800"
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-sm font-bold border-b-2 transition select-none ${
              activeTab === "reviews" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400 hover:text-slate-800"
            }`}
          >
            Reviews ({product.reviews.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[160px]">
          {activeTab === "desc" && (
            <div className="text-xs font-semibold leading-relaxed text-slate-650 max-w-4xl">
              <p className="mb-4">{product.description}</p>
              <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-2xl p-4 text-[11px] text-orange-700 font-bold max-w-2xl mt-4">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <span>Make sure to select the correct color choice before checking out. All screen protectors come with custom tray alignments for guaranteed bubbles-free fits.</span>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b border-slate-100">
                      <td className="py-3 font-bold text-slate-400 w-1/3 uppercase">{key}</td>
                      <td className="py-3 font-bold text-slate-700">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="flex flex-col gap-6 max-w-3xl">
              {product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-slate-100 pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-850">{rev.userName}</h4>
                      <span className="text-[10px] text-slate-400 font-bold">{formatDate(rev.date)}</span>
                    </div>
                    <div className="flex text-amber-400 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < rev.rating ? "currentColor" : "none"}
                          className="text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-semibold">No reviews yet for this product. Be the first to leave one!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-100 pt-12">
          <h2 className="text-xl font-black text-slate-900 mb-6">Related Accessories</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
