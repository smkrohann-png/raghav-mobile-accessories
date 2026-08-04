import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold uppercase tracking-[0.08em] text-emerald-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
