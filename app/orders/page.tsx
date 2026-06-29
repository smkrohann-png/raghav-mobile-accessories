"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Truck, Calendar, MapPin, ChevronDown, ChevronUp, AlertCircle, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { getStoredOrders, updateStoredOrderStatus } from "@/services/mock-db";
import { trackShiprocketShipment } from "@/services/shiprocket";
import { formatPrice, formatDate } from "@/lib/utils";
import { Order } from "@/types";
import Button from "@/components/ui/Button";

export default function OrdersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Simulated tracking info per order ID
  const [trackingInfo, setTrackingInfo] = useState<Record<string, any>>({});

  const { user, isAuthenticated } = useAuthStore();

  const fetchOrders = () => {
    if (user) {
      const stored = getStoredOrders();
      const userOrders = stored.filter((o) => o.userId === user.id);
      setOrders(userOrders);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (mounted && !isAuthenticated) {
      router.push("/login");
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, mounted, user]);

  const toggleExpand = async (orderId: string, trackingNumber?: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    setExpandedOrder(orderId);

    if (trackingNumber && !trackingInfo[orderId]) {
      try {
        const info = await trackShiprocketShipment(trackingNumber);
        setTrackingInfo((prev) => ({ ...prev, [orderId]: info }));
      } catch (err) {
        console.error("Tracking lookup failure", err);
      }
    }
  };

  // Status Badge styler
  const getStatusStyle = (status: Order["status"]) => {
    const styles = {
      pending: "bg-slate-100 text-slate-700 border-slate-200",
      processing: "bg-orange-50 text-orange-600 border-orange-100",
      shipped: "bg-blue-50 text-blue-700 border-blue-100",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
      cancelled: "bg-red-50 text-red-700 border-red-100",
    };
    return styles[status] || styles.pending;
  };

  if (!mounted || !user) {
    return (
      <div className="container py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-baseline justify-between border-b border-slate-100 pb-5 mb-8">
        <h1 className="text-3xl font-black text-slate-900">Order History</h1>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {orders.length} orders placed
        </span>
      </div>

      {orders.length > 0 ? (
        <div className="flex flex-col gap-6">
          {orders.map((ord) => {
            const isExpanded = expandedOrder === ord.id;
            const track = trackingInfo[ord.id];

            return (
              <div key={ord.id} className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden transition-all hover:border-slate-200">
                {/* Header Summary */}
                <div
                  onClick={() => toggleExpand(ord.id, ord.trackingNumber)}
                  className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/40 select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                      <Package size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-805">Order #{ord.id}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center gap-1.5">
                        <Calendar size={12} />
                        {formatDate(ord.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 ml-auto">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold text-right">Total Price:</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{formatPrice(ord.total)}</p>
                    </div>

                    <span className={`text-[10px] font-bold border px-3 py-1 rounded-full uppercase tracking-wider ${getStatusStyle(ord.status)}`}>
                      {ord.status}
                    </span>

                    {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details Area */}
                {isExpanded && (
                  <div className="border-t border-slate-50 p-6 bg-slate-50/20">
                    <div className="grid gap-6 md:grid-cols-2 mb-6">
                      {/* Shipping detail */}
                      <div className="text-xs font-semibold text-slate-650 flex flex-col gap-2">
                        <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                          <MapPin size={13} className="text-orange-500" />
                          Delivery Detail
                        </h4>
                        <p className="text-slate-800 font-bold">{ord.shippingAddress.name}</p>
                        <p>{ord.shippingAddress.line1}, {ord.shippingAddress.line2 ? `${ord.shippingAddress.line2}, ` : ""}{ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}</p>
                        <p className="text-slate-450 mt-1 font-bold">Delivery speed: {ord.shippingMethod}</p>
                      </div>

                      {/* Payment info */}
                      <div className="text-xs font-semibold text-slate-650 flex flex-col gap-1.5">
                        <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-wider mb-1">
                          Billing Summary
                        </h4>
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="text-slate-805">{formatPrice(ord.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-red-500">
                          <span>Discount:</span>
                          <span>-{formatPrice(ord.discount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>{ord.shippingCharge === 0 ? "FREE" : formatPrice(ord.shippingCharge)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-850">
                          <span>Paid Total:</span>
                          <span className="text-orange-500 font-black">{formatPrice(ord.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Products list */}
                    <div className="border-t border-slate-100 pt-5 mb-6">
                      <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-wider mb-3">
                        Products Ordered
                      </h4>
                      <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        {ord.items.map((item) => (
                          <div key={item.productId} className="flex gap-4 p-4 items-center">
                            <img src={item.image} alt={item.name} className="h-10 w-10 object-contain rounded-lg border border-slate-100 p-1" />
                            <div className="text-xs font-bold text-slate-700 min-w-0 flex-grow">
                              <p className="truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Color: {item.color} • Qty: {item.quantity}</p>
                            </div>
                            <span className="text-xs font-black text-slate-950 flex-shrink-0">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shiprocket tracking history */}
                    {ord.trackingNumber && (
                      <div className="border-t border-slate-100 pt-5">
                        <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-wider mb-4 flex items-center gap-1.5">
                          <Truck size={14} className="text-orange-500" />
                          Shiprocket Transit Logs (AWB: {ord.trackingNumber})
                        </h4>

                        {track ? (
                          <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-slate-150">
                            {track.history.map((h: any, i: number) => {
                              const isLast = i === track.history.length - 1;
                              return (
                                <div key={i} className="relative flex flex-col gap-0.5">
                                  {/* Milestone node */}
                                  <div className={`absolute -left-[21px] top-0 h-2.5 w-2.5 rounded-full border-2 ${
                                    isLast ? "bg-orange-500 border-orange-500 animate-ping" : "bg-slate-300 border-slate-300"
                                  }`} />
                                  <div className={`absolute -left-[21px] top-0 h-2.5 w-2.5 rounded-full border-2 ${
                                    isLast ? "bg-orange-500 border-orange-500" : "bg-slate-300 border-slate-300"
                                  }`} />

                                  <p className={`text-[11px] font-bold ${isLast ? "text-orange-500" : "text-slate-700"}`}>
                                    {h.status}
                                  </p>
                                  <p className="text-[10px] text-slate-450 font-semibold">
                                    Location: {h.location} • {h.time}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold animate-pulse">
                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                            Loading tracking milestones...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="container text-center py-20 bg-white rounded-3xl border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <ShoppingBag size={28} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-805">No Orders Yet</h2>
          <p className="text-xs text-slate-500 mt-2">Shortlist cases or audio accessories and place your first order!</p>
          <Button onClick={() => router.push("/shop")} className="mt-6 rounded-full text-xs">
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
}
