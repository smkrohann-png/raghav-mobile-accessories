"use client";

import { useEffect, useState } from "react";
import { getStoredOrders } from "@/services/mock-db";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Calendar, Search } from "lucide-react";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const filtered = orders.filter((o) =>
    o.id.toLowerCase().includes(searchVal.toLowerCase()) ||
    o.shippingAddress.name.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Payments Ledger</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
          Review payment processing ledgers and transaction IDs from Razorpay
        </p>
      </div>

      {/* Filters */}
      <div className="relative w-full max-w-sm border-b border-slate-200 pb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Order ID or customer..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none"
        />
      </div>

      {/* Ledger list */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3">Date</th>
              <th className="py-3">Order ID</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Gateway Mode</th>
              <th className="py-3">Transaction ID</th>
              <th className="py-3">Amount</th>
              <th className="py-3 text-right">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ord) => (
              <tr key={ord.id} className="border-b border-slate-50 font-semibold text-slate-705 hover:bg-slate-50/40">
                <td className="py-3.5 flex items-center gap-1.5 text-slate-450 font-medium mt-1">
                  <Calendar size={12} />
                  {ord.createdAt.split("T")[0]}
                </td>
                <td className="py-3.5 font-bold text-slate-800">#{ord.id}</td>
                <td className="py-3.5">{ord.shippingAddress.name}</td>
                <td className="py-3.5 uppercase">{ord.paymentMethod}</td>
                <td className="py-3.5 font-mono text-slate-400 select-all">{ord.paymentId || "N/A (COD)"}</td>
                <td className="py-3.5 font-black text-slate-900">{formatPrice(ord.total)}</td>
                <td className="py-3.5 text-right font-bold">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    ord.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-600"
                  }`}>
                    {ord.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                  No payment logs found yet. Try placing a checkout order to log ledger transactions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
