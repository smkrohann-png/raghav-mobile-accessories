"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Check } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setIsLoading(false);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      detail: SITE_CONFIG.phone,
      sub: "Mon–Sat, 9AM–7PM IST",
      href: `tel:${SITE_CONFIG.phone}`,
    },
    {
      icon: Mail,
      title: "Email Support",
      detail: SITE_CONFIG.email,
      sub: "Response within 24 hours",
      href: `mailto:${SITE_CONFIG.email}`,
    },
    {
      icon: MapPin,
      title: "Visit Store",
      detail: `${SITE_CONFIG.address.line1}`,
      sub: `${SITE_CONFIG.address.city}, ${SITE_CONFIG.address.state} - ${SITE_CONFIG.address.pincode}`,
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Chat",
      detail: SITE_CONFIG.whatsapp,
      sub: "Instant support for order queries",
      href: `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`,
    },
  ];

  return (
    <div className="container py-12">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900">Contact Support</h1>
        <div className="mt-3 h-1 w-12 rounded-full bg-orange-500 mx-auto" />
        <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Have a query about your order, a return request, or a product question? Our team is available 6 days a week to assist you.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px] items-start">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-800 mb-6">Send Us a Message</h2>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 mb-4">
                <Check size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Message Sent!</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                Thanks for reaching out! Our support team will respond to your query within 24 business hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 text-xs font-bold text-orange-500 hover:text-orange-600"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <Input
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Order #12345 status query"
                required
              />
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your query in detail..."
                  rows={5}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-800 outline-none focus:border-orange-500 transition resize-none"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-2xl h-12 font-bold"
                isLoading={isLoading}
                rightIcon={<Send size={16} />}
              >
                Send Message
              </Button>
            </form>
          )}
        </motion.div>

        {/* Contact Information Cards */}
        <div className="flex flex-col gap-4">
          {contactInfo.map((info, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group"
            >
              <a
                href={info.href || "#"}
                target={info.href?.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500 flex-shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <info.icon size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800">{info.title}</h3>
                  <p className="text-xs font-bold text-orange-500 mt-0.5">{info.detail}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {info.sub}
                  </p>
                </div>
              </a>
            </motion.div>
          ))}

          {/* Map Placeholder */}
          <div className="rounded-2xl overflow-hidden border border-slate-100 h-48 bg-slate-100 relative">
            <img
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&auto=format&fit=crop&q=80"
              alt="Store Location Map"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/95 rounded-2xl p-4 text-center shadow-md">
                <MapPin size={20} className="text-orange-500 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-800">Raghav Mobile Accessories</p>
                <p className="text-[10px] text-slate-500">{SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
