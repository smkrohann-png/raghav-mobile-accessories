import Link from "next/link";

import type { Category } from "@/types/product";
import { cn } from "@/lib/utils";

const toneClasses = {
  orange: "bg-orange-50 text-orange-600 ring-orange-100",
  navy: "bg-slate-100 text-slate-900 ring-slate-200",
  silver: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  mint: "bg-orange-50 text-orange-600 ring-orange-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  graphite: "bg-stone-100 text-stone-700 ring-stone-200",
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;

  return (
    <Link
      href="/products"
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60"
    >
      <div className={cn("mb-8 grid h-14 w-14 place-items-center rounded-2xl ring-1", toneClasses[category.tone])}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="mt-auto">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-950">{category.name}</h3>
          <span className="text-sm font-semibold text-slate-400">{category.count}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{category.description}</p>
      </div>
    </Link>
  );
}
