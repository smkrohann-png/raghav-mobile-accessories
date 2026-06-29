"use client";

import { useEffect, useState } from "react";
import { getStoredOrders } from "@/services/mock-db";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types";
import { TrendingUp, TrendingDown, Users, ShoppingBag, Package, Star } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 14280);
  const avgOrderValue =
    orders.length > 0
      ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length)
      : 1785;

  // Category breakdown counts
  const categoryCounts = PRODUCTS.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const topBrands = PRODUCTS.reduce<Record<string, number>>((acc, p) => {
    acc[p.brand] = (acc[p.brand] || 0) + 1;
    return acc;
  }, {});

  const topRated = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 5);

  // Monthly mock data for chart
  const monthlyData = [
    { month: "Jan", revenue: 8200, orders: 15 },
    { month: "Feb", revenue: 9100, orders: 18 },
    { month: "Mar", revenue: 11400, orders: 22 },
    { month: "Apr", revenue: 10600, orders: 20 },
    { month: "May", revenue: 13800, orders: 27 },
    { month: "Jun", revenue: totalRevenue, orders: orders.length + 28 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue));

  const kpiCards = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      change: "+14.2%",
      positive: true,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Avg. Order Value",
      value: formatPrice(avgOrderValue),
      change: "+6.1%",
      positive: true,
      icon: ShoppingBag,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Total Products",
      value: String(PRODUCTS.length),
      change: "+2 this month",
      positive: true,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Avg. Product Rating",
      value: "4.7 ★",
      change: "+0.2 vs last month",
      positive: true,
      icon: Star,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Sales Analytics</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
          Revenue trends, product performance, and customer distribution insights
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                <card.icon size={18} />
              </div>
              <span
                className={`text-[10px] font-bold flex items-center gap-1 ${
                  card.positive ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {card.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {card.change}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{card.value}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Bar Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-6">Monthly Revenue Trend (INR)</h3>
        <div className="flex items-end gap-4 h-48">
          {monthlyData.map((m) => {
            const heightPct = (m.revenue / maxRevenue) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-slate-500 rotate-0">
                  {formatPrice(m.revenue)}
                </span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-orange-500 to-orange-400 transition-all duration-700 hover:from-orange-600 hover:to-orange-500 relative group"
                  style={{ height: `${heightPct}%`, minHeight: "8px" }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                    {m.orders} orders
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Category breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-5">Product Category Distribution</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / PRODUCTS.length) * 100);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5 capitalize">
                    <span>{cat.replace("-", " ")}</span>
                    <span className="text-slate-400">{count} products ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Rated Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-5">Top Rated Products</h3>
          <div className="flex flex-col gap-4">
            {topRated.map((prod, i) => (
              <div key={prod.id} className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-300 w-4">#{i + 1}</span>
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="h-10 w-10 object-contain rounded-lg border border-slate-100 p-1 bg-slate-50"
                />
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{prod.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-0.5">{prod.brand} · {prod.reviewsCount} reviews</p>
                </div>
                <span className="text-xs font-black text-amber-500 flex-shrink-0">
                  ⭐ {prod.rating}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Performance Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-5">Brand Performance Overview</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Object.entries(topBrands).map(([brand, count]) => (
            <div
              key={brand}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center hover:border-orange-200 transition"
            >
              <h4 className="text-sm font-black text-slate-800">{brand}</h4>
              <p className="text-xs text-slate-400 font-bold mt-1">{count} accessories</p>
              <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full"
                  style={{ width: `${(count / PRODUCTS.length) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
