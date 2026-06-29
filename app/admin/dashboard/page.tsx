"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { PRODUCTS } from "@/data/products";
import { getStoredOrders } from "@/services/mock-db";
import { Order } from "@/types";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenue, setRevenue] = useState(14280);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetched = getStoredOrders();
    setOrders(fetched);

    // Calculate revenue
    const totalRev = fetched
      .filter((o) => o.paymentStatus === "paid" || o.status === "delivered")
      .reduce((sum, o) => sum + o.total, 14280); // Seed base for demo
    setRevenue(totalRev);

    // low stock count
    const lowStock = PRODUCTS.filter((p) => p.stock < 60).length;
    setLowStockCount(lowStock);
  }, []);

  const stats = [
    { label: "Total Revenue", val: formatPrice(revenue), icon: DollarSign, color: "text-emerald-500 bg-emerald-50" },
    { label: "Orders Count", val: orders.length + 8, icon: ShoppingBag, color: "text-orange-500 bg-orange-50" },
    { label: "Active Products", val: PRODUCTS.length, icon: Package, color: "text-blue-500 bg-blue-50" },
    { label: "Low Stock Items", val: lowStockCount, icon: AlertTriangle, color: "text-amber-500 bg-amber-50" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Admin Dashboard</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
          Store overview, sales distributions and low stock warnings
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 leading-none">{s.val}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sales Graph */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800">Monthly Sales Revenue</h3>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp size={12} />
              +14% vs Last Month
            </span>
          </div>

          {/* SVG Line Graph */}
          <div className="h-60 w-full relative">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="0" y1="180" x2="500" y2="180" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />

              {/* Chart Line Path */}
              <path
                d="M 10 160 Q 100 130 180 90 T 320 60 T 450 40 L 490 30"
                fill="none"
                stroke="#ff6b00"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Area Under Curve */}
              <path
                d="M 10 160 Q 100 130 180 90 T 320 60 T 450 40 L 490 30 L 490 180 L 10 180 Z"
                fill="url(#grad)"
                opacity="0.1"
              />

              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b00" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>

              {/* Points */}
              <circle cx="180" cy="90" r="4.5" fill="#ff6b00" />
              <circle cx="320" cy="60" r="4.5" fill="#ff6b00" />
              <circle cx="450" cy="40" r="4.5" fill="#ff6b00" />
            </svg>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold px-2 mt-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        {/* Category Share Graph */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Revenue Share</h3>
          
          {/* SVG Pie/Donut Chart */}
          <div className="flex flex-col items-center gap-6">
            <div className="h-32 w-32 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                {/* Covers: 40% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ff6b00" strokeWidth="3.2" strokeDasharray="40 100" strokeDashoffset="0" />
                {/* Audio: 30% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="30 100" strokeDashoffset="-40" />
                {/* Chargers: 20% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" strokeDasharray="20 100" strokeDashoffset="-70" />
                {/* Others: 10% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.2" strokeDasharray="10 100" strokeDashoffset="-90" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-850">₹1.4L</span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">Sales</span>
              </div>
            </div>

            {/* Labels */}
            <div className="grid grid-cols-2 gap-4 w-full text-[10px] font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Covers (40%)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Audio (30%)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Chargers (20%)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Cables/Glass (10%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-slate-800">Recent Customer Orders</h3>
          <Link href="/admin/orders" className="text-xs font-bold text-orange-500 hover:text-orange-655 flex items-center gap-1.5">
            View All Orders
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3">Order ID</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Date</th>
                <th className="py-3">Payment</th>
                <th className="py-3">Grand Total</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="border-b border-slate-50 font-semibold text-slate-700 hover:bg-slate-50/40">
                  <td className="py-3.5 font-bold text-slate-800">#{ord.id}</td>
                  <td className="py-3.5">{ord.shippingAddress.name}</td>
                  <td className="py-3.5 flex items-center gap-1.5 text-slate-400 font-medium">
                    <Calendar size={12} />
                    {ord.createdAt.split("T")[0]}
                  </td>
                  <td className="py-3.5 uppercase">{ord.paymentMethod}</td>
                  <td className="py-3.5 font-black text-slate-900">{formatPrice(ord.total)}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      ord.status === "delivered" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-600"
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                    No orders placed yet in this session. Try checking out an item!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
