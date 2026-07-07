"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/Badge";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D",
  },
  {
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1800&q=90",
  },
  {
    image:
      "https://images.unsplash.com/photo-1635861321688-b63d28749a82?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRhYmxlJTIwY2hhcmdlcnN8ZW58MHx8MHx8fDA%3D",
  },
];


export function Hero() {
  return (
    <section className="bg-white">
      {/* ================= Hero Banner ================= */}

      <div className="relative h-[410px] overflow-hidden bg-black sm:h-[460px] lg:h-[525px]">
        {heroSlides.map((slide, index) => (
          <Image
            key={index}
            src={slide.image}
            alt="Hero"
            fill
            priority={index === 0}
            sizes="100vw"
            className="hero-slide absolute inset-0 object-cover"
            style={{
              animationDelay: `${index * 5}s`,
            }}
          />
        ))}

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/90 via-[#030712]/55 via-[28%] to-transparent" />

        <div className="absolute left-0 top-0 h-full w-[38%] bg-gradient-to-r from-black/30 via-black/10 to-transparent blur-xl" />

        {/* Content */}

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-center px-6 sm:px-10 lg:px-20">
          <div className="max-w-[620px]">
            <Badge className="border-white/20 bg-white/10 text-white backdrop-blur-md">
              PREMIUM MOBILE ACCESSORIES
            </Badge>

            <h1 className="mt-5 text-5xl font-black leading-[0.95] text-white lg:text-7xl">
              Raghav Mobile Accessories
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              Carefully curated cases, chargers, wireless audio,
              power banks and premium accessories designed for
              everyday performance.
            </p>
          </div>
        </div>

        {/* Slider Dots */}

        <div className="absolute bottom-7 left-8 z-20 flex gap-3 lg:left-16">
          {heroSlides.map((_, index) => (
            <span
              key={index}
              className="hero-dot h-[4px] w-10 rounded-full bg-white/40"
              style={{
                animationDelay: `${index * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

    </section>
  );
}