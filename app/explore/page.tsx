import { WhyChooseRaghav } from "@/components/sections/HomeSections";
import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore | Raghav Mobile Accessories",
  description: "Learn why we are the best choice for premium mobile accessories, our simple order process, and store highlights.",
};

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
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">Explore Raghav Mobile</h1>
          <p className="mt-4 text-lg text-slate-600">Discover what makes our store the preferred destination for mobile accessories.</p>
        </div>
      </div>
      
      {/* This component contains Why Choose Us, Simple Order Process, and Store Highlights */}
      <WhyChooseRaghav />

      {/* Our Promise Section */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <ShieldCheck className="h-16 w-16 text-orange-500 mb-6" />
            <h2 className="text-4xl font-black mb-6">Our Promise</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              We believe every customer deserves premium products, honest pricing, secure packaging and reliable support.<br />
              Your satisfaction is always our highest priority.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-600 mb-2">FAQS</p>
              <h2 className="text-4xl font-black text-slate-950">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {faqs.map((faq, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-950 mb-3">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}