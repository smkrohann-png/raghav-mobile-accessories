import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1600px] px-5 sm:px-6 md:px-8 xl:px-10 2xl:px-12",
        className
      )}
    >
      {children}
    </div>
  );
}