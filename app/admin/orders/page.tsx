"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getStoredOrders, updateStoredOrderStatus } from "@/services/mock-db";
import { ShoppingBag, ChevronDown, ChevronUp, Eye, Truck, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = (orderId: string, status: Order["status"]) => {
    updateStoredOrderStatus(orderId, status);
    fetchOrders();
  };

  // Shiprocket webhook simulator
  const handleSimulateWebhook = (orderId: string) => {
    // Advance status cycle: pending -> processing -> shipped -> delivered
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;

    let nextStatus: Order["status"] = "pending";
    if (ord.status === "pending") nextStatus = "processing";
    else if (ord.status === "processing") nextStatus = "shipped";
    else if (ord.status === "shipped") nextStatus = "delivered";
    else if (ord.status === "delivered") nextStatus = "cancelled";

    updateStoredOrderStatus(orderId, nextStatus);
    fetchOrders();
    alert(`Shiprocket Hook Triggered: Order status transitioned to '${nextStatus}'`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Order Management</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
          Track customer payments, dispatch items, and trigger Shiprocket API webhooks
        </p>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3">Order ID</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Paid Total</th>
              <th className="py-3">Method</th>
              <th className="py-3">Payment</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => {
              const isExpanded = expandedId === ord.id;
              return (
                <>
                  <tr key={ord.id} className="border-b border-slate-50 font-semibold text-slate-700 hover:bg-slate-50/40">
                    <td className="py-4 font-bold text-slate-800">#{ord.id}</td>
                    <td className="py-4">{ord.shippingAddress.name}</td>
                    <td className="py-4 font-black text-slate-950">{formatPrice(ord.total)}</td>
                    <td className="py-4 uppercase">{ord.paymentMethod}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        ord.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-600"
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as Order["status"])}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSimulateWebhook(ord.id)}
                          title="Simulate Shiprocket transit update"
                          className="p-2 border border-slate-150 rounded-xl hover:border-orange-500 hover:text-orange-500 transition text-slate-500"
                        >
                          <Truck size={14} />
                        </button>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : ord.id)}
                          className="p-2 border border-slate-150 rounded-xl hover:border-slate-400 transition text-slate-500"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <tr className="bg-slate-50/30">
                      <td colSpan={7} className="p-6 border-b border-slate-100">
                        <div className="grid gap-6 md:grid-cols-2 text-xs font-semibold text-slate-650">
                          <div>
                            <h4 className="font-black text-slate-800 uppercase text-[9px] tracking-wider mb-2">
                              Shipping & Pincode info
                            </h4>
                            <p>{ord.shippingAddress.line1}, {ord.shippingAddress.line2 ? `${ord.shippingAddress.line2}, ` : ""}{ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}</p>
                            <p className="mt-1 font-medium text-slate-450">Mobile: {ord.shippingAddress.phone}</p>
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 uppercase text-[9px] tracking-wider mb-2">
                              Items Ordered
                            </h4>
                            <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-white">
                              {ord.items.map((item) => (
                                <div key={item.productId} className="flex justify-between items-center p-3 text-[11px]">
                                  <span>{item.name} (Qty: {item.quantity} - {item.color})</span>
                                  <span className="font-black text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-405 font-bold">
                  No orders placed yet. Check out some mobile covers or audio earbuds in shop to test!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
