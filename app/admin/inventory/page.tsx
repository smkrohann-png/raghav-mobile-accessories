"use client";

import { useState } from "react";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Search, Save, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminInventoryPage() {
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [searchVal, setSearchVal] = useState("");

  const handleStockChange = (prodId: string, value: number) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, stock: Math.max(0, value) } : p))
    );
  };

  const handleSaveStock = (prodId: string, stockVal: number) => {
    alert(`Inventory Updated: Stock level synchronized to ${stockVal} units.`);
  };

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Inventory Tracker</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
          Directly modify product stock volumes or view critical low warnings
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative w-full max-w-sm border-b border-slate-200 pb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search products by name..."
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
              <th className="py-3">Product Name</th>
              <th className="py-3">Current Stock</th>
              <th className="py-3">Stock Controller</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod) => (
              <tr key={prod.id} className="border-b border-slate-50 font-semibold text-slate-705 hover:bg-slate-50/40">
                <td className="py-4 flex items-center gap-3">
                  <img src={prod.images[0]} alt={prod.name} className="h-10 w-10 object-contain rounded-lg border border-slate-100 p-1" />
                  <span className="font-bold text-slate-800 max-w-[280px] truncate">{prod.name}</span>
                </td>
                <td className="py-4 font-black text-slate-900">{prod.stock} Units</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={prod.stock}
                      onChange={(e) => handleStockChange(prod.id, Number(e.target.value))}
                      className="w-32 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <input
                      type="number"
                      value={prod.stock}
                      onChange={(e) => handleStockChange(prod.id, Number(e.target.value))}
                      className="h-8 w-14 rounded-lg border border-slate-200 text-center font-bold outline-none"
                    />
                  </div>
                </td>
                <td className="py-4">
                  {prod.stock < 60 ? (
                    <span className="text-amber-600 flex items-center gap-1.5 font-bold">
                      <AlertTriangle size={14} className="text-amber-500 animate-pulse" />
                      Low Stock Threshold
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold">Healthy Stock</span>
                  )}
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handleSaveStock(prod.id, prod.stock)}
                    className="p-2 border border-slate-150 rounded-xl hover:border-orange-500 hover:text-orange-500 transition text-slate-500 hover:bg-orange-50"
                  >
                    <Save size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
