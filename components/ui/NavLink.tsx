"use client";

import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
}

export default function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="group relative inline-flex h-11 items-center rounded-full px-4 text-base font-semibold tracking-wide text-slate-700 transition duration-300 ease-out hover:-translate-y-1 hover:text-slate-950"
    >
      {label}
      <span className="absolute bottom-1 left-4 h-[2px] w-0 rounded-full bg-emerald-500 transition-all duration-300 ease-out group-hover:w-[calc(100%-2rem)]" />
    </Link>
  );
}
