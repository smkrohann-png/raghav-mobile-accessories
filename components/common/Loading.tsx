import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          {/* Animated Circle */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-500 animate-pulse">
          Loading Raghav Mobile Accessories...
        </p>
      </div>
    </div>
  );
}
