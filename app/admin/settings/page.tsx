"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/constants/site";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save, Settings, Key, Store, Truck, CreditCard, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState(SITE_CONFIG.name);
  const [storeEmail, setStoreEmail] = useState(SITE_CONFIG.email);
  const [storePhone, setStorePhone] = useState(SITE_CONFIG.phone);
  const [storeAddress, setStoreAddress] = useState(`${SITE_CONFIG.address.line1}, ${SITE_CONFIG.address.city}`);
  const [razorpayKey, setRazorpayKey] = useState("rzp_test_mockKey12345");
  const [razorpaySecret, setRazorpaySecret] = useState("••••••••••••••••••••");
  const [shiprocketEmail, setShiprocketEmail] = useState("store@raghavmobile.com");
  const [freeShipThreshold, setFreeShipThreshold] = useState(499);
  const [enableCOD, setEnableCOD] = useState(true);
  const [enableRazorpay, setEnableRazorpay] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Store Settings</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            Configure store preferences, API keys, and shipping rules
          </p>
        </div>
        <Button
          type="submit"
          variant="primary"
          className="rounded-2xl h-11 text-xs font-bold"
          leftIcon={<Save size={16} />}
        >
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Store Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-1.5">
          <Store size={16} className="text-orange-500" />
          Store Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <Input
            label="Support Email"
            type="email"
            value={storeEmail}
            onChange={(e) => setStoreEmail(e.target.value)}
          />
          <Input
            label="Contact Phone"
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
          />
          <Input
            label="Store Address"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
          />
        </div>
      </div>

      {/* Payment & Shipping Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-1.5">
          <CreditCard size={16} className="text-orange-500" />
          Payment Configuration
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <Input
            label="Razorpay Key ID"
            value={razorpayKey}
            onChange={(e) => setRazorpayKey(e.target.value)}
          />
          <Input
            label="Razorpay Secret"
            type="password"
            value={razorpaySecret}
            onChange={(e) => setRazorpaySecret(e.target.value)}
          />
        </div>

        {/* Toggle Switches */}
        <div className="flex flex-col gap-4">
          {[
            { label: "Enable Cash on Delivery (COD)", value: enableCOD, setter: setEnableCOD },
            { label: "Enable Razorpay Online Payments", value: enableRazorpay, setter: setEnableRazorpay },
          ].map((toggle) => (
            <div key={toggle.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
              <span className="text-xs font-bold text-slate-700">{toggle.label}</span>
              <button
                type="button"
                onClick={() => toggle.setter(!toggle.value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  toggle.value ? "bg-orange-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    toggle.value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-1.5">
          <Truck size={16} className="text-orange-500" />
          Shiprocket Configuration
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Shiprocket Account Email"
            value={shiprocketEmail}
            onChange={(e) => setShiprocketEmail(e.target.value)}
          />
          <Input
            label="Free Shipping Threshold (₹)"
            type="number"
            value={freeShipThreshold}
            onChange={(e) => setFreeShipThreshold(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Notification & Store Mode */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-1.5">
          <Bell size={16} className="text-orange-500" />
          Notifications & Store Mode
        </h3>

        <div className="flex flex-col gap-4">
          {[
            {
              label: "Email Notifications for New Orders",
              value: emailNotifications,
              setter: setEmailNotifications,
            },
            {
              label: "Maintenance Mode (Temporarily Close Store)",
              value: maintenanceMode,
              setter: setMaintenanceMode,
            },
          ].map((toggle) => (
            <div
              key={toggle.label}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${
                toggle.label.includes("Maintenance") && toggle.value
                  ? "border-red-200 bg-red-50/40"
                  : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <span className="text-xs font-bold text-slate-700 max-w-xs">{toggle.label}</span>
              <button
                type="button"
                onClick={() => toggle.setter(!toggle.value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  toggle.value
                    ? toggle.label.includes("Maintenance")
                      ? "bg-red-500"
                      : "bg-orange-500"
                    : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    toggle.value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
