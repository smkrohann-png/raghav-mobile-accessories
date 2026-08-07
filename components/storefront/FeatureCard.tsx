import type { LucideIcon } from "lucide-react";

export function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
