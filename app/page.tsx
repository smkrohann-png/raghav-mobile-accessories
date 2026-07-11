import { BrandStrip } from "@/components/sections/HomeSections";
import { Hero } from "@/components/sections/Hero";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStrip />

      <section className="bg-slate-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Ready to Upgrade Your Experience?
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Discover our premium collection of mobile accessories designed for everyday performance.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-orange-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-600/25"
              >
                Shop Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}