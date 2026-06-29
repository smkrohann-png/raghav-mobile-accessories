"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Package, MapPin, Truck, ArrowRight, ShoppingBag } from "lucide-react";
import { getStoredOrders } from "@/services/mock-db";
import { formatPrice, formatDate } from "@/lib/utils";
import { Order } from "@/types";
import Button from "@/components/ui/Button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const orderId = searchParams.get("id");
    if (orderId) {
      const orders = getStoredOrders();
      const found = orders.find((o) => o.id === orderId);
      if (found) {
        setOrder(found);
      }
    }
  }, [searchParams]);

  if (!mounted) {
    return (
      <div className="container py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">We couldn't retrieve the details for this order code.</p>
        <Button onClick={() => router.push("/")} className="mt-6 rounded-full">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      {/* Top success alert banner */}
      <div className="flex flex-col items-center text-center mb-12">
        <CheckCircle2 size={64} className="text-emerald-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-black text-slate-900">Order Placed Successfully!</h1>
        <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">
          Thank you for shopping with us. Your receipt has been sent to your email.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_340px]">
        {/* Invoice & Products */}
        <div className="flex flex-col gap-6">
          {/* Order Meta details */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Package size={16} className="text-orange-500" />
              Order Info
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              <div>
                <p className="text-slate-400">Order ID:</p>
                <p className="text-slate-850 font-black mt-0.5">{order.id}</p>
              </div>
              <div>
                <p className="text-slate-400">Date & Time:</p>
                <p className="text-slate-850 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-slate-400">Payment Status:</p>
                <p className="text-emerald-600 font-bold capitalize mt-0.5">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="text-slate-400">Payment Mode:</p>
                <p className="text-slate-850 uppercase mt-0.5">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Delivery & Tracking Details */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Truck size={16} className="text-orange-500" />
              Shiprocket Delivery Status
            </h3>
            <div className="text-xs font-semibold text-slate-650 flex flex-col gap-3.5">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 font-bold">Delivery Address:</p>
                  <p className="text-slate-800 mt-1">
                    {order.shippingAddress.name} <br />
                    {order.shippingAddress.line1}, {order.shippingAddress.line2 ? `${order.shippingAddress.line2}, ` : ""}
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="border-t border-slate-50 pt-4 flex flex-wrap gap-4 justify-between items-center">
                  <div>
                    <p className="text-slate-400 font-bold">Shiprocket Tracking ID:</p>
                    <p className="text-orange-500 font-black mt-0.5 tracking-wider">{order.trackingNumber}</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    AWB ASSIGNED
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Items Invoiced */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">
              Items Purchased
            </h3>
            <div className="divide-y divide-slate-150">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-4 py-4 items-center">
                  <img src={item.image} alt={item.name} className="h-12 w-12 object-contain border border-slate-100 p-1 rounded-xl bg-slate-50" />
                  <div className="flex-grow text-xs font-bold text-slate-750 min-w-0">
                    <p className="truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-405 mt-0.5">Color: {item.color} • Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-black text-slate-950 flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Summary Column */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5">
              Invoice Summary
            </h3>
            <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-5 mb-5 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charge</span>
                <span className="text-slate-800">
                  {order.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingCharge)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="text-sm font-bold text-slate-800">Paid Total</span>
              <span className="text-2xl font-black text-orange-500">{formatPrice(order.total)}</span>
            </div>

            <Link href="/orders">
              <Button variant="primary" className="w-full rounded-2xl h-11 text-xs font-bold shadow-md shadow-orange-50" rightIcon={<ArrowRight size={14} />}>
                Track My Orders
              </Button>
            </Link>
            <Link href="/shop" className="mt-3.5 block">
              <Button variant="outline" className="w-full rounded-2xl h-11 text-xs font-bold">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
