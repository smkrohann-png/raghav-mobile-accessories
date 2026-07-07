import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  muted = false,
}: {
  children: ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", muted && "bg-slate-50", className)}>
      {children}
    </section>
  );
}
