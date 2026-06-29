"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Phone, Calendar, Search } from "lucide-react";
import { getStoredOrders } from "@/services/mock-db";
import { formatPrice } from "@/lib/utils";

interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<MockCustomer[]>([]);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    // Generate customer summaries from mock data
    const orders = getStoredOrders();
    const customerMap: Record<string, { totalSpent: number; ordersCount: number }> = {};
    
    orders.forEach((o) => {
      const uId = o.userId || "guest";
      if (!customerMap[uId]) {
        customerMap[uId] = { totalSpent: 0, ordersCount: 0 };
      }
      customerMap[uId].totalSpent += o.total;
      customerMap[uId].ordersCount += 1;
    });

    const mockCustomers: MockCustomer[] = [
      {
        id: "u-1",
        name: "Raghav Kumar",
        email: "raghav@example.com",
        phone: "+91 98765 43210",
        ordersCount: customerMap["u-1"]?.ordersCount || 0,
        totalSpent: customerMap["u-1"]?.totalSpent || 0,
        joinedDate: "2026-01-10",
      },
      {
        id: "u-2",
        name: "Aniket Sharma",
        email: "aniket@example.com",
        phone: "+91 91234 56789",
        ordersCount: customerMap["u-2"]?.ordersCount || 2,
        totalSpent: customerMap["u-2"]?.totalSpent || 3298,
        joinedDate: "2026-03-14",
      },
      {
        id: "u-3",
        name: "Pooja Patel",
        email: "pooja@example.com",
        phone: "+91 90909 09090",
        ordersCount: customerMap["u-3"]?.ordersCount || 1,
        totalSpent: customerMap["u-3"]?.totalSpent || 1499,
        joinedDate: "2026-05-20",
      },
    ];

    setCustomers(mockCustomers);
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    c.email.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Customer Accounts</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
          View registered customer details, orders counts and total spent
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative w-full max-w-sm border-b border-slate-200 pb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none"
        />
      </div>

      {/* Table list */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3">Name</th>
              <th className="py-3">Email & Contact</th>
              <th className="py-3">Joined Date</th>
              <th className="py-3 text-center">Orders Count</th>
              <th className="py-3 text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 font-semibold text-slate-705 hover:bg-slate-50/40">
                <td className="py-3.5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                    {c.name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-850">{c.name}</span>
                </td>
                <td className="py-3.5">
                  <p className="flex items-center gap-1.5 text-slate-700">
                    <Mail size={12} className="text-slate-400" />
                    {c.email}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400 font-medium mt-0.5">
                    <Phone size={12} className="text-slate-400" />
                    {c.phone}
                  </p>
                </td>
                <td className="py-3.5 flex items-center gap-1.5 text-slate-400 font-medium mt-1">
                  <Calendar size={12} />
                  {c.joinedDate}
                </td>
                <td className="py-3.5 text-center font-bold text-slate-800">{c.ordersCount}</td>
                <td className="py-3.5 text-right font-black text-slate-900">{formatPrice(c.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
