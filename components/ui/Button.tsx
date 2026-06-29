"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none rounded-full";

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 hover:from-orange-600 hover:to-orange-700",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-transparent",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-orange-500 hover:text-orange-600",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/10",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs gap-1.5",
    md: "h-11 px-6 text-sm gap-2",
    lg: "h-14 px-8 text-base gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!isLoading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}

      <span className="truncate">{children}</span>

      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}