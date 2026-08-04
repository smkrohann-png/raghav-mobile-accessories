import { Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { storeInfo } from "@/lib/store-info";

const footerLinks = [
  ["Products", "/products"],
  ["Explore", "/explore"],
  ["Reviews", "/reviews"],
  ["Cart", "/cart"],
  ["About", "/about"],
  ["Support", "/support"],
];

export function Footer() {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeInfo.address)}`;

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <Container>
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.7fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-base font-black">RA</span>
              <span>
                <span className="block text-sm font-black uppercase tracking-[0.13em]">Raghav</span>
                <span className="block text-xs font-semibold text-slate-400">Mobile Accessories</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              Premium phone cases, chargers, audio, screen protection and desk essentials curated for clean everyday tech.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-300">Explore</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {footerLinks.map(([label, href]) => (
                <Link className="text-sm text-slate-400 transition hover:text-white" href={href} key={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-300">Store</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-400">
              <a className="flex gap-3 transition hover:text-white" href={mapHref} target="_blank" rel="noreferrer">
                <MapPin className="h-5 w-5 shrink-0 text-emerald-400" />
                {storeInfo.address}
              </a>
              <a className="flex gap-3 transition hover:text-white" href={`tel:+${storeInfo.phoneRaw}`}>
                <Phone className="h-5 w-5 shrink-0 text-emerald-400" />
                {storeInfo.phone}
              </a>
              <a className="flex gap-3 break-all transition hover:text-white" href={`mailto:${storeInfo.email}`}>
                <Mail className="h-5 w-5 shrink-0 text-emerald-400" />
                {storeInfo.email}
              </a>
              <p className="flex gap-3"><Send className="h-5 w-5 shrink-0 text-emerald-400" /> @raghavaccessories</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Raghav Mobile Accessories. All rights reserved.</p>
          <p>Designed & Developed by @smkrohan | smkrohan.space ↗</p>
        </div>
      </Container>
    </footer>
  );
}
