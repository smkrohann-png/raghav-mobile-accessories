"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
  Shield,
  type LucideProps,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import NavLink from "@/components/ui/NavLink";
import { useAuthStore } from "@/store/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/explore", label: "Explore" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (

    <header className={`sticky top-0 z-50 transition-transform duration-300 ease-out ${showNavbar ? "translate-y-0" : "-translate-y-full"} bg-[#111827] shadow-xl shadow-black/20`}>

     {/* ================= Announcement Bar ================= */}

<div className="hidden h-10 items-center justify-center bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white sm:flex">
  <p className="text-sm font-semibold tracking-wide">
    🚚 Free Shipping on Orders Above ₹999 • 100% Genuine Products • Fast Delivery
  </p>
</div>

<div className="flex h-9 items-center justify-center bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 px-4 text-center text-[11px] font-semibold text-white sm:hidden">
  🚚 Free Shipping • COD Available
</div>
      <Container className="max-w-none bg-white px-4 sm:px-5 lg:px-6 2xl:px-8">

        <div className="flex h-18 min-h-18 items-center justify-between gap-3 pt-3 pb-2 sm:h-20 lg:gap-6">

          {/* Logo */}

          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
          >

            <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.05,
              }}
              transition={{
                duration: .25,
              }}
              className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,_#111827_50%,_#f97316_50%)] text-lg font-black text-white shadow-lg sm:h-12 sm:w-12 sm:text-xl"
            >
              R
            </motion.div>

            <div className="min-w-0 leading-none">
              <h2 className="truncate text-[15px] font-black uppercase tracking-[0.1em] text-slate-950 sm:text-[18px] sm:tracking-[0.14em]">
                RAGHAV
              </h2>
              <p className="mt-1 text-[12px] font-semibold tracking-wide text-orange-600">
                Mobile Accessories
              </p>
            </div>

          </Link>
          {/* ================= Desktop Navigation ================= */}

          <nav
            className="hidden flex-1 items-center justify-center xl:flex"
            aria-label="Primary Navigation"
          >
            <div className="flex items-center gap-8">

              {links.map((item) => (

                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                />

              ))}

            </div>
          </nav>

          {/* ================= Right Side ================= */}

          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <form action="/search" method="get" className="hidden relative h-11 w-[min(28vw,320px)] rounded-full border border-slate-200 bg-white shadow-sm lg:flex">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-600" />
              <input
                type="search"
                name="q"
                placeholder="Search accessories..."
                className="h-full w-full rounded-full border-none bg-transparent pl-12 pr-4 text-base font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </form>

            {user?.role === 'admin' && (
              <IconButton
                href="/admin/dashboard"
                label="Admin Panel"
                icon={<Shield className="h-5 w-5" />}
                className="hidden sm:grid !bg-gradient-to-br !from-red-500 !to-red-600 !border-red-500 !text-white hover:!from-red-600 hover:!to-red-700 hover:!border-red-600 hover:shadow-lg hover:shadow-red-500/30"
              />
            )}

            <IconButton
              href="/search"
              label="Search products"
              icon={<Search className="h-5 w-5" />}
              className="lg:hidden"
            />

            <IconButton
              href="/cart"
              label="Cart"
              icon={<ShoppingBag className="h-5 w-5" />}
            />

            <IconButton
  href="/profile"
  label="Profile"
  icon={<UserRound className="h-5 w-5" />}
  className="hidden sm:grid !bg-gradient-to-br !from-orange-500 !to-orange-600 !border-orange-500 !text-white hover:!from-orange-600 hover:!to-orange-700 hover:!border-orange-600 hover:shadow-lg hover:shadow-orange-500/30"
/>

            {/* Mobile Toggle */}

            <motion.button
              whileTap={{ scale: .9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 sm:h-11 sm:w-11 xl:hidden"
            >

              <AnimatePresence mode="wait">

                {mobileOpen ? (

                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: .2 }}
                  >

                    <X className="h-5 w-5" />

                  </motion.div>

                ) : (

                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: .2 }}
                  >

                    <Menu className="h-5 w-5" />

                  </motion.div>

                )}

              </AnimatePresence>

            </motion.button>

          </div>

        </div>

        {/* ================= Mobile Menu ================= */}

        <AnimatePresence>

          {mobileOpen && (

            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: .22, ease: "easeOut" }}
              className="mb-4 overflow-hidden rounded-3xl border border-white/80 bg-white/92 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl xl:hidden"
            >

              <div className="grid gap-1 p-3">

                <form action="/search" method="get" className="relative mb-2 flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    type="search"
                    name="q"
                    placeholder="Search products..."
                    className="ml-3 h-full w-full bg-transparent text-[15px] font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setMobileOpen(false);
                      }
                    }}
                  />
                </form>

                {links.map((item) => (

                  <MobileNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    onClick={() => setMobileOpen(false)}
                  />

                ))}

                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  <MobileNavItem href="/profile" label="Profile" onClick={() => setMobileOpen(false)} compact />
                  <MobileNavItem href="/cart" label="Cart" onClick={() => setMobileOpen(false)} compact />
                  {user?.role === 'admin' && (
                    <MobileNavItem href="/admin/dashboard" label="Admin" onClick={() => setMobileOpen(false)} compact icon={Shield} />
                  )}
                  {!user && (
                    <MobileNavItem href="/login" label="Login" onClick={() => setMobileOpen(false)} compact />
                  )}
                </div>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </Container>

    </header>
  );
}

function MobileNavItem({
  href,
  label,
  onClick,
  compact = false,
  icon: Icon,
}: {
  href: string;
  label: string;
  onClick: () => void;
  compact?: boolean;
  icon?: React.ComponentType<LucideProps>;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-2xl text-[15px] font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center gap-2 ${compact ? "px-4 py-3 text-center" : "px-5 py-4"}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );
}

function IconButton({
  href,
  label,
  icon,
  className,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md sm:h-11 sm:w-11 ${className ?? ""}`}
    >
      <span>{icon}</span>
    </Link>
  );
}
