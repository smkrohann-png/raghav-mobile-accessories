import { CheckCircle2, Circle, Clock3, XCircle } from "lucide-react";

import { orderStatuses } from "@/data/commerce";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/commerce";

export function OrderTimeline({
  currentStatus,
}: {
  currentStatus: OrderStatus;
}) {
  const isCancelled = currentStatus === "Cancelled";
  const activeIndex = orderStatuses.indexOf(currentStatus);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-950">Order timeline</h3>
        <StatusBadge status={currentStatus} />
      </div>
      <div className="space-y-4">
        {(isCancelled ? ["Pending", "Cancelled"] : orderStatuses).map((status, index, list) => {
          const done = !isCancelled && index <= activeIndex;
          const active = status === currentStatus;

          return (
            <div className="grid grid-cols-[2rem_1fr] gap-3" key={status}>
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full border text-slate-400",
                    done && "border-emerald-600 bg-emerald-600 text-white",
                    active && isCancelled && "border-rose-600 bg-rose-600 text-white",
                  )}
                >
                  {active && isCancelled ? (
                    <XCircle className="h-4 w-4" />
                  ) : done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : active ? (
                    <Clock3 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                </span>
                {index < list.length - 1 ? <span className={cn("h-8 w-px bg-slate-200", done && "bg-emerald-200")} /> : null}
              </div>
              <div className="pb-4">
                <p className="font-bold text-slate-950">{status}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {status === currentStatus ? "Current order status" : done ? "Completed" : "Waiting for update"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const cancelled = status === "Cancelled";

  return (
    <span
      className={cn(
        "inline-flex h-8 items-center rounded-full px-3 text-xs font-bold uppercase tracking-[0.08em]",
        cancelled ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700",
      )}
    >
      {status}
    </span>
  );
}
