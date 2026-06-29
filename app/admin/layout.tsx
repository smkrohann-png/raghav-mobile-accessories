"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  Package,
  ShoppingBag,
  Users,
  Layers,
  Archive,
  Ticket,
  CreditCard,
  Settings,
  BarChart3,
  ArrowLeft,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { SITE_CONFIG } from "@/constants/site";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    if (mounted && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login");
    }
  }, [isAuthenticated, user, mounted]);

  if (!mounted || !user || user.role !== "admin") {
    return (
      <div className="container py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500" />
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Inventory", href: "/admin/inventory", icon: Archive },
    { label: "Coupons", href: "/admin/coupons", icon: Ticket },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Analytics", href: "/admin/analytics", icon: SlidersHorizontal },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white p-5 shadow-sm transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex lg:flex-col ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Brand details */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-lg font-black text-white">
              R
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800 leading-tight">
                {SITE_CONFIG.shortName} Panel
              </h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Store Console
              </p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-full bg-slate-100 p-1.5 lg:hidden">
            <X size={16} />
          </button>
        </div>

        {/* Menu list */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                  active
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom profile back link */}
        <div className="border-t border-slate-100 pt-5 mt-auto">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft size={15} />
            Back to Profile
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shadow-sm relative z-30">
          <button onClick={() => setSidebarOpen(true)} className="rounded-xl border border-slate-200 p-2 lg:hidden">
            <Menu size={18} />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 ml-auto bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-100">
            <UserCheck size={14} className="text-emerald-500" />
            <span>Super Administrator Mode</span>
          </div>
        </header>

        {/* Inner Content scrollable */}
        <main className="p-6 md:p-8 overflow-y-auto flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
