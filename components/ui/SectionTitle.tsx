import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-orange-600">{eyebrow}</p> : null}
        <h2 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">{title}</h2>
        {description ? <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
