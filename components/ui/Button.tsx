import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "bg-emerald-600 !text-white shadow-[0_16px_34px_rgba(234,88,12,0.26)] hover:bg-emerald-700",
  secondary: "border border-slate-200 bg-white text-slate-950 shadow-sm hover:border-emerald-200 hover:bg-emerald-50",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
  destructive: "bg-rose-600 !text-white shadow-[0_16px_34px_rgba(225,29,72,0.22)] hover:bg-rose-700",
};

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function Button({
  children,
  className,
  href,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-normal transition duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
