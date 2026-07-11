import { BrandStrip } from "@/components/sections/HomeSections";
import { Hero } from "@/components/sections/Hero";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStrip />

<section className="bg-white py-16">
  <Container>
    <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-slate-950 px-8 py-14 shadow-2xl sm:px-12 lg:px-20">

      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
          Discover Premium Mobile Accessories Designed for Performance
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 lg:text-lg">
          Every product
          is chosen for its quality, reliability, and value, backed by secure
          shopping, fast shipping, Cash on Delivery, and dedicated customer
          support.
        </p>

        <Link
          href="/products"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3 font-semibold text-white! transition duration-300 hover:bg-orange-600"
        >
          Shop Now
        </Link>
      </div>

    </div>
  </Container>
</section>
    </>
  );
}