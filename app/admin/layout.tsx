"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  Boxes,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  Star,
  Tags,
  TicketPercent,
  Truck,
  UsersRound,
  X,
} from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/products", icon: Boxes, label: "Products" },
  { href: "/admin/categories", icon: Tags, label: "Categories" },
  { href: "/admin/users", icon: UsersRound, label: "Customers" },
  { href: "/admin/shiprocket", icon: Truck, label: "Shiprocket" },
  { href: "/admin/reviews", icon: Star, label: "Reviews" },
  { href: "/admin/coupons", icon: TicketPercent, label: "Coupons" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLogin = pathname === "/admin";

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLogin && !isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, isLogin, router, user]);

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    router.replace("/admin");
  }

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="lg:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700"
          aria-label="Open admin navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-black">Raghav HQ</p>
          <p className="truncate text-xs font-semibold text-slate-500">{user?.email || "Admin"}</p>
        </div>
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close admin navigation overlay"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0",
          collapsed ? "lg:w-[88px]" : "lg:w-[280px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">RH</span>
            {!collapsed ? (
              <span className="min-w-0">
                <span className="block truncate text-sm font-black">Raghav HQ</span>
                <span className="block truncate text-xs font-semibold text-slate-500">Commerce admin</span>
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 lg:inline-flex"
            aria-label="Collapse navigation"
          >
            <ChevronLeft className={cn("h-4 w-4 transition", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="grid gap-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Link
                  href={href}
                  key={label}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition",
                    active ? "bg-orange-50 text-orange-700" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                    collapsed && "lg:justify-center lg:px-0",
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed ? <span className="truncate">{label}</span> : null}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-200 p-3">
          {!collapsed ? (
            <div className="mb-3 rounded-xl bg-slate-50 p-3">
              <p className="truncate text-sm font-black">{user ? `${user.firstName} ${user.lastName}` : "Admin"}</p>
              <p className="mt-1 truncate text-xs font-semibold text-slate-500">{user?.email}</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50",
              collapsed && "lg:justify-center lg:px-0",
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed ? <span>Logout</span> : null}
          </button>
        </div>
      </aside>

      <main className={cn("h-[calc(100vh-4rem)] overflow-y-auto p-4 lg:h-screen lg:p-6", collapsed ? "lg:ml-[88px]" : "lg:ml-[280px]")}>
        {isLoading && !user ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-600 shadow-sm">
            Loading admin workspace...
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
