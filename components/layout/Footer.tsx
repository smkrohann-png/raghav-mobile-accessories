"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";
import Button from "@/components/ui/Button";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="container">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-12">
          {/* Brand Bio */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-lg font-black text-white">
                R
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">
                {SITE_CONFIG.name}
              </h2>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm mb-6">
              Premium store for your mobile covers, tempered glass, fast wall chargers, type-c cables, power banks, and high-fidelity wireless earbuds. India's trusted choice for mobile protection and audio gear.
            </p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\+/g, "").replace(/\s/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-white hover:border-orange-500 transition"
              >
                <MessageSquare size={13} className="text-green-500" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">
              Shop Now
            </h3>
            <ul className="space-y-3.5 text-xs font-semibold">
              <li>
                <Link href="/shop" className="hover:text-orange-500 transition">
                  Browse All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-orange-500 transition">
                  Shop By Category
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=featured" className="hover:text-orange-500 transition">
                  Featured Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=deals" className="hover:text-orange-500 transition">
                  Today's Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">
              Info & Support
            </h3>
            <ul className="space-y-3.5 text-xs font-semibold">
              <li>
                <Link href="/about" className="hover:text-orange-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-500 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-orange-500 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-500 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">
              Get In Touch
            </h3>
            <ul className="space-y-4 text-xs font-semibold">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <span>
                  {SITE_CONFIG.address.line1}, {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}, India - {SITE_CONFIG.address.pincode}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-orange-500 flex-shrink-0" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-orange-500 transition">
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-orange-500 flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-orange-500 transition">
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-slate-800 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h4 className="text-sm font-bold text-white tracking-wider mb-2">
              SUBSCRIBE TO OUR NEWSLETTER
            </h4>
            <p className="text-xs text-slate-500">
              Get the latest updates on new product launches, exclusive sales, and holiday promo codes.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="relative w-full max-w-sm flex items-center">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-full bg-slate-800 border border-slate-700 px-5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 focus:bg-slate-800/80 transition-all pr-12"
            />
            <button
              type="submit"
              className="absolute right-1 flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 transition text-white"
            >
              <Send size={14} />
            </button>
          </form>
        </div>

        {/* Copyright and Badge */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
          <p>{SITE_CONFIG.copyright}</p>
          <div className="flex gap-2.5">
            <span className="bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-md">Razorpay Protected</span>
            <span className="bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-md">Shiprocket Fulfilled</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
