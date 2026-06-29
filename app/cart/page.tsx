"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Trash2, ArrowRight, ShoppingBag, BadgePercent, X, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { validateCouponCode } from "@/services/mock-db";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const { items, coupon, updateQuantity, removeItem, applyCoupon, getTotals } = useCartStore();
  const { subtotal, discount, shipping, total } = getTotals();

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

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponCode.trim()) return;

    const res = validateCouponCode(couponCode, subtotal);
    if (res.success && res.coupon) {
      applyCoupon(res.coupon);
      setCouponSuccess(res.message);
    } else {
      setCouponError(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    applyCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  if (items.length === 0) {
    return (
      <div className="container py-24 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-55 text-orange-500">
            <ShoppingBag size={28} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs font-semibold text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added any premium mobile accessories to your cart yet. Explore covers, chargers, and earbuds now!
        </p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button variant="primary" className="rounded-full">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  // Free shipping goal calculator
  const freeShippingThreshold = 499;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Cart items list */}
        <div className="flex flex-col gap-5">
          {/* Shipping Goal Progress Bar */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs font-bold text-slate-600 mb-3">
                Add <span className="text-orange-500 font-extrabold">{formatPrice(remainingForFreeShipping)}</span> more to get <span className="text-emerald-600">FREE Shipping!</span>
              </p>
            ) : (
              <p className="text-xs font-bold text-emerald-600 mb-3 flex items-center gap-1.5">
                🎉 Congratulations! Your order qualifies for <strong>FREE Shipping</strong>.
              </p>
            )}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-4 p-6 flex-wrap sm:flex-nowrap items-center">
                  {/* Product Image */}
                  <Link href={`/product/${item.product.id}`} className="flex-shrink-0 bg-slate-50 border rounded-2xl p-2.5 h-20 w-20 flex items-center justify-center">
                    <img src={item.product.images[0]} alt={item.product.name} className="max-h-16 object-contain" />
                  </Link>

                  {/* Details */}
                  <div className="flex-grow min-w-[150px]">
                    <Link href={`/product/${item.product.id}`} className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-orange-500 transition">
                      {item.product.name}
                    </Link>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-2">
                      <span>Brand: {item.product.brand}</span>
                      {item.selectedColor && (
                        <>
                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span>Color: {item.selectedColor}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs font-black text-slate-900 mt-2">{formatPrice(item.product.price)}</p>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-9 bg-white">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                      className="px-2.5 hover:bg-slate-50 text-slate-500 transition font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                      className="px-2.5 hover:bg-slate-50 text-slate-500 transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="flex flex-col items-end gap-2 ml-auto">
                    <span className="text-sm font-black text-slate-950">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedColor)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Summary Side Card */}
        <div className="flex flex-col gap-5">
          {/* Coupon Box */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <BadgePercent size={16} className="text-orange-500" />
              Apply Discount Coupon
            </h3>

            {coupon ? (
              <div className="flex items-center justify-between rounded-xl bg-orange-50/70 border border-orange-100 p-3.5">
                <div>
                  <p className="text-xs font-bold text-orange-700">Code: {coupon.code}</p>
                  <p className="text-[10px] text-orange-500 font-semibold mt-0.5">
                    {coupon.discountType === "percentage" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`} applied
                  </p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="rounded-full bg-orange-500/10 hover:bg-orange-500/20 p-1.5 text-orange-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. SUMMER40)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-orange-500"
                />
                <Button type="submit" variant="primary" className="h-10 rounded-xl px-4 text-xs">
                  Apply
                </Button>
              </form>
            )}

            {couponError && <p className="mt-2 text-[10px] font-bold text-red-500">{couponError}</p>}
            {couponSuccess && <p className="mt-2 text-[10px] font-bold text-emerald-600">{couponSuccess}</p>}
          </div>

          {/* Pricing Totals */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5">
              Order Pricing
            </h3>

            <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-5 mb-5 text-xs font-semibold text-slate-650">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Coupon Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charge</span>
                <span className="text-slate-800">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="text-sm font-bold text-slate-800">Grand Total</span>
              <span className="text-2xl font-black text-orange-500">{formatPrice(total)}</span>
            </div>

            <Link href="/checkout">
              <Button variant="primary" className="w-full rounded-2xl h-12 font-bold shadow-md" rightIcon={<ArrowRight size={16} />}>
                Proceed To Checkout
              </Button>
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Razorpay Secured Transactions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
