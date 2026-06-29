"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  Truck,
  BadgePercent,
  ShieldCheck,
  LogOut,
  Sliders,
} from "lucide-react";

import { NAV_LINKS, USER_MENU } from "@/constants/nav-links";
import { SITE_CONFIG } from "@/constants/site";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuthStore } from "@/store/auth-store";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Connect stores
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, isAuthenticated, logout } = useAuthStore();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
useEffect(() => {
  requestAnimationFrame(() => {
    setMounted(true);
  });

  const onScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  window.addEventListener("scroll", onScroll);

  return () => {
    window.removeEventListener("scroll", onScroll);
  };
}, []);
useEffect(() => {
  requestAnimationFrame(() => {
    setMobileOpen(false);
    setShowProfileMenu(false);
  });
}, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement */}
      <div className="hidden lg:block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white">
        <div className="container flex h-10 items-center justify-between gap-6 text-[11px] font-semibold tracking-[0.18em]">
          <div className="flex items-center gap-2">
            <Truck size={14} />
            <span>FREE SHIPPING ABOVE ₹499 IN INDIA</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgePercent size={14} />
            <span>USE COUPON: SUMMER40 FOR 40% OFF</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            <span>100% ORIGINAL ACCESSORIES BRAND WARRANTY</span>
          </div>
        </div>
      </div>

      <header
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-slate-100 bg-white/95 shadow-md backdrop-blur-xl"
            : "bg-white"
        }`}
      >
        <div className="container">
          <div className="flex min-h-20 items-center justify-between gap-4 py-4 lg:grid lg:grid-cols-[220px_minmax(0,1fr)_320px] lg:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 select-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-xl font-black text-white shadow-md shadow-orange-500/20">
                R
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 leading-tight">
                  {SITE_CONFIG.shortName}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                  Mobile Lifestyle
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden min-w-0 justify-center lg:flex">
              <div className="flex max-w-full items-center gap-1 rounded-full border border-slate-100 bg-slate-50/80 p-1 shadow-inner">
                {NAV_LINKS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} className="relative">
                      {active && (
                        <motion.div
                          layoutId="navbar-active"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-md shadow-orange-500/10"
                        />
                      )}
                      <span
                        className={`relative z-10 flex h-10 items-center rounded-full px-4 xl:px-6 text-[14px] font-semibold transition-colors ${
                          active
                            ? "text-white"
                            : "text-slate-600 hover:text-orange-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="hidden items-center justify-end gap-3 lg:flex">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-52 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-800 transition-all focus:w-60 focus:border-orange-500 focus:bg-white"
                />
              </form>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-150 bg-white transition hover:-translate-y-0.5 hover:border-orange-500 hover:bg-orange-50"
              >
                <Heart
                  size={18}
                  className="text-slate-600 transition group-hover:text-orange-500"
                />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white shadow-md shadow-orange-500/20 animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                href="/cart"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-150 bg-white transition hover:-translate-y-0.5 hover:border-orange-500 hover:bg-orange-50"
              >
                <ShoppingCart
                  size={18}
                  className="text-slate-600 transition group-hover:text-orange-500"
                />
                {mounted && cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-[9px] font-bold text-white shadow-md shadow-orange-500/20">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Authentication Dropdown */}
              {mounted && isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 hover:border-orange-500 transition"
                  >
                    {user.avatar ? (
                      <Image
  src={user.avatar}
  alt={user.name}
  width={32}
  height={32}
  className="h-8 w-8 rounded-full object-cover"
/>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="max-w-[80px] truncate text-xs font-semibold text-slate-700 pr-2">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <>
                        <div
                          onClick={() => setShowProfileMenu(false)}
                          className="fixed inset-0 z-10 bg-transparent"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-20"
                        >
                          <div className="px-4 py-2 border-b border-slate-50 mb-1">
                            <p className="text-xs font-bold text-slate-800">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {user.email}
                            </p>
                          </div>

                          {user.role === "admin" && (
                            <Link
                              href="/admin/dashboard"
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-orange-500 transition"
                            >
                              <Sliders size={14} />
                              Admin Dashboard
                            </Link>
                          )}

                          {USER_MENU.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-orange-500 transition"
                            >
                              <User size={14} />
                              {item.label}
                            </Link>
                          ))}

                          <button
                            onClick={() => {
                              logout();
                              router.push("/");
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                          >
                            <LogOut size={14} />
                            Log Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-xs font-semibold text-white shadow-md shadow-orange-500/10 hover:shadow-lg transition-all"
                >
                  <User size={14} />
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Actions and Menu Trigger */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link
                href="/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100"
              >
                <ShoppingCart size={16} className="text-slate-700" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-xl bg-slate-100 p-1.5 transition"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  duration: 0.35,
                  ease: "easeInOut",
                }}
                className="fixed right-0 top-0 z-50 flex h-screen w-[85%] max-w-sm flex-col bg-white shadow-2xl lg:hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <div>
                    <h2 className="text-lg font-black text-slate-800">
                      {SITE_CONFIG.shortName}
                    </h2>
                    <p className="text-[10px] font-semibold text-slate-400">
                      Premium Mobile Accessories
                    </p>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full bg-slate-100 p-1.5"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {/* Search */}
                  <form onSubmit={handleSearchSubmit} className="relative mb-6">
                    <Search
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none"
                    />
                  </form>

                  <h3 className="mb-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Navigation Links
                  </h3>
                  <nav className="flex flex-col gap-1 mb-8">
                    {NAV_LINKS.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                            active
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                              : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>

                  {mounted && isAuthenticated && user && (
                    <>
                      <h3 className="mb-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Account Settings
                      </h3>
                      <nav className="flex flex-col gap-1">
                        {user.role === "admin" && (
                          <Link
                            href="/admin/dashboard"
                            className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        {USER_MENU.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </nav>
                    </>
                  )}
                </div>

                <div className="border-t border-slate-100 p-6">
                  {mounted && isAuthenticated ? (
                    <button
                      onClick={() => {
                        logout();
                        router.push("/");
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-red-500/10"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/10"
                    >
                      Login Account
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
      </AnimatePresence>
      </header>

    </div>
  );
}
