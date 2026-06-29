"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BadgePercent, ArrowRight, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("WELCOME100");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-slate-950 px-8 py-12 text-white md:px-16 md:py-20 shadow-xl"
        >
          {/* Decorative Mesh Blurs */}
          <div className="absolute -left-10 -top-10 h-60 w-60 rounded-full bg-orange-600/20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400">
                <BadgePercent size={14} />
                Get ₹100 Flat OFF On Your First Order
              </div>
              <h2 className="text-3xl font-black leading-tight tracking-tight md:text-4xl lg:text-5xl">
                Ready to Upgrade Your Mobile Gear?
              </h2>
              <p className="mt-4 text-xs font-medium text-slate-400 max-w-md leading-relaxed">
                Join our newsletter club today. Get notified about Spigen case drops, new boAt ANC earbuds launches, and flash sales.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 rounded-2xl bg-slate-900 border border-slate-800 px-4 text-sm outline-none focus:border-orange-500 transition"
                />
                <Button
                  onClick={() => alert("Successfully joined!")}
                  variant="primary"
                  className="h-12 rounded-2xl font-bold"
                  rightIcon={<ArrowRight size={16} />}
                >
                  Join Club
                </Button>
              </div>

              {/* Coupon showcase */}
              <div className="flex items-center gap-3 mt-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-4 w-fit">
                <div className="text-xs">
                  <p className="font-bold text-slate-300">Use Welcome Code:</p>
                  <p className="font-black text-orange-500 text-sm tracking-widest mt-0.5">WELCOME100</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600 transition"
                >
                  {copied ? <Check size={14} /> : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
