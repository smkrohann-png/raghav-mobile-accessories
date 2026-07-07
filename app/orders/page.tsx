"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";

import { OrderTimeline, StatusBadge } from "@/components/commerce/OrderTimeline";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useProfileStore } from "@/store/profile";
import { formatCurrency } from "@/lib/utils";

export default function OrdersPage() {
  const { orders, fetchOrders, isLoading, error } = useProfileStore();
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedId) || orders[0],
    [orders, selectedId],
  );

  return (
    <Section muted>
      <Container>
        <SectionTitle
          eyebrow="Order tracking"
          title="Track every status from pending to delivered."
          description="Customer view reflects COD, courier status, admin messages and live status updates."
        />
        {error ? <p className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
        {isLoading ? <p className="rounded-2xl bg-white p-5 text-sm font-semibold text-slate-600 shadow-sm">Loading orders...</p> : null}
        {!isLoading && !selectedOrder ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-bold text-slate-950">No orders yet</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Place your first order and its live status will appear here.</p>
            <Button href="/shop" className="mt-5">Shop products</Button>
          </div>
        ) : null}
        {selectedOrder ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <PackageSearch className="h-10 w-10 text-orange-600" />
                  <h1 className="mt-4 text-3xl font-black text-slate-950">{selectedOrder.id}</h1>
                  <p className="mt-2 text-sm font-semibold text-slate-500">Placed on {new Date(selectedOrder.date).toLocaleString()}</p>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </div>
              {orders.length > 1 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {orders.map((order) => (
                    <button className={`rounded-full px-4 py-2 text-sm font-bold ${order.id === selectedId ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-700"}`} key={order.id} onClick={() => setSelectedId(order.id)}>
                      {order.id}
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Detail label="Customer" value={selectedOrder.customerName || selectedOrder.customer} />
                <Detail label="Phone" value={selectedOrder.phone} />
                <Detail label="Payment" value={selectedOrder.paymentMethod} />
                <Detail label="Amount" value={formatCurrency(selectedOrder.amount)} />
                <Detail label="Courier" value={`${selectedOrder.shippingProvider || "Shiprocket"} - ${selectedOrder.shippingStatus || "Pending"}`} />
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="font-bold text-slate-950">Status messages</p>
                <div className="mt-4 space-y-3">
                  {selectedOrder.messages.map((message) => (
                    <div className="rounded-2xl bg-white p-4 text-sm shadow-sm" key={`${message.status}-${message.time}`}>
                      <p className="font-bold text-slate-950">{message.status}</p>
                      <p className="mt-1 leading-6 text-slate-600">{message.text}</p>
                      <p className="mt-2 text-xs font-semibold text-slate-400">{new Date(message.time).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
            <OrderTimeline currentStatus={selectedOrder.status} />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 font-bold text-slate-950">{value}</p>
    </div>
  );
}
