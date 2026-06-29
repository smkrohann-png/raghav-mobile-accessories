import React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  className,
}: SectionTitleProps) {
  const alignments = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={cn("flex flex-col mb-12", alignments[align], className)}>
      <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>
      <div className="mt-3.5 h-1 w-12 rounded-full bg-orange-500" />
      {subtitle && (
        <p className="mt-4 max-w-2xl text-slate-500 md:text-lg font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
