"use client";

import { useEffect, useState } from "react";
import { Coupon } from "@/types";
import { getStoredCoupons, addStoredCoupon } from "@/services/mock-db";
import { Plus, Ticket, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState(0);
  const [minSpend, setMinSpend] = useState(0);
  const [expiry, setExpiry] = useState("2026-12-31");

  const fetchCoupons = () => {
    setCoupons(getStoredCoupons());
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggle = (couponCode: string) => {
    if (typeof window === "undefined") return;
    const current = getStoredCoupons();
    const updated = current.map((c) =>
      c.code === couponCode ? { ...c, isActive: !c.isActive } : c
    );
    localStorage.setItem("rma-coupons", JSON.stringify(updated));
    fetchCoupons();
  };

  const handleRemove = (couponCode: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      if (typeof window === "undefined") return;
      const current = getStoredCoupons();
      const updated = current.filter((c) => c.code !== couponCode);
      localStorage.setItem("rma-coupons", JSON.stringify(updated));
      fetchCoupons();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCoupon: Coupon = {
      code: code.toUpperCase().trim(),
      discountType: type,
      value: Number(value),
      minSpend: minSpend ? Number(minSpend) : undefined,
      expiryDate: expiry,
      isActive: true,
    };

    addStoredCoupon(newCoupon);
    fetchCoupons();
    setIsModalOpen(false);

    // Reset fields
    setCode("");
    setValue(0);
    setMinSpend(0);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Coupon Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            Create promotional discount codes and toggle active campaigns
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" className="rounded-2xl h-11 text-xs font-bold" leftIcon={<Plus size={16} />}>
          Create Coupon
        </Button>
      </div>

      {/* Coupons grid list */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.code} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 h-10 w-10 rounded-bl-2xl bg-orange-500/5 flex items-center justify-center text-orange-500">
              <Ticket size={18} />
            </div>

            <div>
              <h3 className="text-base font-black text-orange-500 tracking-wider mb-2">{c.code}</h3>
              <p className="text-xs font-bold text-slate-800 capitalize mb-1">
                Value: {c.discountType === "percentage" ? `${c.value}% OFF` : `₹${c.value} OFF`}
              </p>
              {c.minSpend && <p className="text-[10px] text-slate-450 font-bold mb-1">Min Spend: ₹{c.minSpend}</p>}
              <p className="text-[10px] text-slate-400 font-bold mb-6">Expires: {c.expiryDate}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
              <button
                onClick={() => handleToggle(c.code)}
                className="flex items-center gap-1 text-xs font-bold transition-all text-slate-600 hover:text-slate-800"
              >
                {c.isActive ? (
                  <>
                    <ToggleRight size={22} className="text-emerald-500" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={22} className="text-slate-300" />
                    <span>Paused</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleRemove(c.code)}
                className="p-1.5 border border-slate-150 rounded-xl hover:border-red-500 hover:text-red-500 transition text-slate-500"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Coupon Code" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Promo Coupon Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. FESTIVE20"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">Discount Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="h-11 w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 text-xs font-semibold text-slate-800 outline-none focus:border-orange-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (INR)</option>
              </select>
            </div>
            <Input
              label="Discount Value"
              type="number"
              value={value || ""}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="e.g. 20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Spend (Optional)"
              type="number"
              value={minSpend || ""}
              onChange={(e) => setMinSpend(Number(e.target.value))}
              placeholder="e.g. 499"
            />
            <Input
              label="Expiry Date"
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full rounded-2xl h-11 mt-4">
            Create Campaign
          </Button>
        </form>
      </Modal>
    </div>
  );
}
