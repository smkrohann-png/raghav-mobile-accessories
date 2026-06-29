import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  className,
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full select-none tracking-wide";

  const variants = {
    primary: "bg-orange-50 text-orange-600 border border-orange-100",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    danger: "bg-rose-50 text-rose-700 border border-rose-100",
    info: "bg-sky-50 text-sky-700 border border-sky-100",
    neutral: "bg-slate-50 text-slate-600 border border-slate-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] leading-4",
    md: "px-3 py-1 text-xs leading-5",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
