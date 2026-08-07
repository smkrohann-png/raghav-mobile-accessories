import Image from "next/image";
import { BatteryCharging, Cable, Headphones, Shield, Smartphone, TabletSmartphone, Zap } from "lucide-react";

import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

const toneStyles = {
  orange: "from-orange-100 via-white to-amber-50 text-orange-600",
  navy: "from-slate-100 via-white to-blue-50 text-slate-900",
  silver: "from-slate-50 via-white to-zinc-100 text-slate-500",
  mint: "from-orange-50 via-white to-cyan-50 text-orange-600",
  violet: "from-violet-50 via-white to-slate-50 text-violet-600",
  graphite: "from-slate-100 via-white to-stone-100 text-slate-800",
};

export function ProductVisual({
  product,
  className,
  hero = false,
}: {
  product: Product;
  className?: string;
  hero?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] min-h-52 w-full max-w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br",
        toneStyles[product.tone],
        className,
      )}
    >
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={hero ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover"
          priority={hero}
        />
      ) : (
        <>
          <div className="absolute inset-x-8 top-8 h-16 rounded-full bg-white/70 blur-2xl" />
          <div className="absolute bottom-5 h-8 w-3/5 rounded-full bg-slate-950/10 blur-xl" />
          <VisualShape product={product} hero={hero} />
        </>
      )}
    </div>
  );
}

function VisualShape({ product, hero }: { product: Product; hero: boolean }) {
  const size = hero ? "h-64 w-44 sm:h-72 sm:w-52 md:h-80 md:w-60 lg:h-96 lg:w-72" : "h-44 w-32 sm:h-48 sm:w-36";

  if (product.visual === "case") {
    return (
      <div className={cn("relative rounded-[2rem] border-8 border-current bg-white/62 shadow-2xl", size)}>
        <div className="absolute left-5 top-5 h-12 w-12 rounded-2xl border-4 border-current bg-white" />
        <div className="absolute inset-x-8 bottom-5 h-1 rounded-full bg-current/35" />
      </div>
    );
  }

  if (product.visual === "charger") {
    return (
      <div className="relative grid place-items-center">
        <div className="h-44 w-36 rounded-[1.75rem] bg-white shadow-2xl ring-1 ring-slate-200" />
        <Zap className="absolute h-14 w-14" strokeWidth={1.6} />
        <div className="absolute -top-7 flex gap-3">
          <span className="h-10 w-3 rounded-full bg-slate-800" />
          <span className="h-10 w-3 rounded-full bg-slate-800" />
        </div>
      </div>
    );
  }

  if (product.visual === "cable") {
    return (
      <div className="relative grid place-items-center">
        <Cable className="h-44 w-44 drop-shadow-2xl" strokeWidth={1.35} />
        <Zap className="absolute h-12 w-12 rounded-full bg-white/80 p-2 shadow-lg" strokeWidth={1.7} />
      </div>
    );
  }

  if (product.visual === "earbuds") {
    return (
      <div className="relative h-56 w-64">
        <div className="absolute bottom-3 left-1/2 h-28 w-44 -translate-x-1/2 rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200" />
        <Headphones className="absolute left-1/2 top-5 h-28 w-28 -translate-x-1/2" strokeWidth={1.45} />
        <span className="absolute bottom-10 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-current/25" />
      </div>
    );
  }

  if (product.visual === "powerbank") {
    return (
      <div className="relative h-52 w-36 rounded-[2rem] bg-slate-900 text-white shadow-2xl">
        <BatteryCharging className="absolute left-1/2 top-12 h-14 w-14 -translate-x-1/2 text-orange-400" strokeWidth={1.6} />
        <div className="absolute inset-x-7 bottom-10 grid grid-cols-4 gap-1">
          <span className="h-2 rounded-full bg-orange-400" />
          <span className="h-2 rounded-full bg-orange-400" />
          <span className="h-2 rounded-full bg-white/70" />
          <span className="h-2 rounded-full bg-white/30" />
        </div>
      </div>
    );
  }

  if (product.visual === "glass") {
    return (
      <div className={cn("relative rounded-[2rem] border border-white/80 bg-white/28 shadow-2xl backdrop-blur-md ring-1 ring-slate-200", size)}>
        <Shield className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <div className="relative">
      <TabletSmartphone className="h-44 w-44 drop-shadow-2xl" strokeWidth={1.15} />
      <Smartphone className="absolute -right-4 bottom-1 h-24 w-24 rounded-2xl bg-white/60" strokeWidth={1.25} />
    </div>
  );
}
