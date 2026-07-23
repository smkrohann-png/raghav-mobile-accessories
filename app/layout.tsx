import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";

import { AppShell } from "@/components/layout/AppShell";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Raghav Mobile Accessories",
    template: "%s | Raghav Mobile Accessories",
  },
  description:
    "Premium mobile accessories ecommerce store for cases, chargers, earbuds, power banks, screen protectors and desk essentials.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col bg-white text-slate-950 antialiased">
        <AppShell>{children}</AppShell>
        <GoogleAnalytics gaId="G-QZD1FT2J1J" />
      </body>
    </html>
  );
}
