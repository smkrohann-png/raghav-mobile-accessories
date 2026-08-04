"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { WhyChooseRaghav } from "@/components/sections/HomeSections";
import { ShieldCheck } from "lucide-react";

const faqs = [
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer: "Yes, we exclusively offer Cash on Delivery for all our orders to ensure a safe and trustworthy shopping experience.",
  },
  {
    question: "How long does shipping take?",
    answer: "Most orders are dispatched within 24 hours and delivered within 3-5 working days depending on your location.",
  },
  {
    question: "Are your products genuine?",
    answer: "Absolutely. We only stock 100% genuine and premium quality accessories. Every product is quality-checked before dispatch.",
  },
  {
    question: "What is your return policy?",
    answer: "If you receive a damaged or incorrect product, you can request a replacement within 7 days of delivery. Please contact our support team for assistance.",
  },
];

export default function ExplorePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      
      <WhyChooseRaghav />

      {/* Our Promise Section */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <ShieldCheck className="h-16 w-16 text-emerald-500 mb-6" />
            <h2 className="text-4xl font-black mb-6">Our Promise</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              We believe every customer deserves premium products, honest pricing, secure packaging and reliable support.<br />
              Your satisfaction is always our highest priority.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
<section className="bg-white py-28">
  <div className="container mx-auto px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">

      <div className="mb-16 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-emerald-600">
          FAQs
        </p>

        <h2 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-slate-600">
          Everything you need to know about ordering, delivery, payments,
          returns, warranty and our premium mobile accessories.
        </p>
      </div>

      <div className="w-full space-y-5">

        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300
              ${
                isOpen
                  ? "border-emerald-300 shadow-md"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-8 py-6 text-left"
              >
                <h3 className="pr-10 text-[21px] font-bold tracking-tight text-slate-900">
                  {faq.question}
                </h3>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? "rotate-180 text-emerald-500"
                      : "text-slate-500"
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-8 pb-6">
                    <p className="text-[17px] leading-7 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  </div>
</section>
    </div>
  );
}