"use client";

import { MessageCircle } from "lucide-react";
import { storeInfo } from "@/lib/store-info";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${storeInfo.phoneRaw}?text=${encodeURIComponent(storeInfo.whatsappMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 right-5 z-[999] flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_45px_rgba(37,211,102,.5)] ring-8 ring-[#25D366]/15 transition-all duration-300 hover:scale-110 sm:bottom-8 sm:right-8 sm:h-18 sm:w-18"
    >
      <MessageCircle className="relative z-10 h-8 w-8 sm:h-9 sm:w-9" />

      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-20" />
    </a>
  );
}
