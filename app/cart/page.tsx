"use client";

import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductVisual } from "@/components/storefront/ProductVisual";

export default function CartPage() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { cart, fetchCart, updateQuantity, removeFromCart, getTotalPrice, isLoading, error } = useCartStore();
  const subtotal = getTotalPrice();

  useEffect(() => {
    checkAuth().then(() => fetchCart());
  }, [checkAuth, fetchCart]);

  return (
    <Section muted>
      <Container>
        <SectionTitle eyebrow="Cart" title="Your upgrade kit is ready." description="Review selected accessories, quantities and checkout total." />
        {!isAuthenticated ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-bold text-slate-950">Login required</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Please login or create an account so your cart, address and order updates stay connected.</p>
            <Button href="/login" className="mt-5">Login to continue</Button>
          </div>
        ) : null}
        {error ? <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
        <div className="grid gap-6 lg:grid-cols-[1fr_0.42fr]">
          <div className="space-y-4">
            {isLoading ? <EmptyCart text="Loading cart..." /> : null}
            {!isLoading && (!cart || cart.items.length === 0) ? <EmptyCart text="Your cart is empty. Add products from the shop to start checkout." /> : null}
            {cart?.items.map((item) => item.product ? (
              <article className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[180px_1fr_auto]" key={item.productId}>
                <ProductVisual product={item.product} className="min-h-36 rounded-2xl" />
                <div className="self-center">
                  <p className="text-sm font-semibold text-slate-500">{item.product.category}</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">{item.product.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">{item.product.color}</p>
                  <div className="mt-4 inline-flex h-10 items-center rounded-full border border-slate-200 bg-slate-50">
                    <button className="grid h-10 w-10 place-items-center" aria-label="Decrease quantity" onClick={() => updateQuantity(item.productId, item.quantity - 1)}><Minus className="h-4 w-4" /></button>
                    <span className="min-w-8 px-3 text-center text-sm font-bold">{item.quantity}</span>
                    <button className="grid h-10 w-10 place-items-center" aria-label="Increase quantity" onClick={() => updateQuantity(item.productId, item.quantity + 1)}><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                  <p className="text-xl font-black text-slate-950">{formatCurrency(item.product.price * item.quantity)}</p>
                  <button className="mt-0 inline-grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500 hover:text-orange-600 sm:mt-5" aria-label={`Remove ${item.product.name}`} onClick={() => removeFromCart(item.productId)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ) : null)}
          </div>
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <ShoppingBag className="h-8 w-8 text-orange-600" />
            <h2 className="mt-4 text-2xl font-bold text-slate-950">Order summary</h2>
            <div className="mt-6 space-y-4 text-sm">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              <Row label="Shipping" value="Calculated at checkout" />
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
              <span className="font-bold text-slate-950">Subtotal</span>
              <span className="text-2xl font-black text-slate-950">{formatCurrency(subtotal)}</span>
            </div>
            <Button href={cart?.items.length ? "/checkout" : "/shop"} className="mt-6 w-full" size="lg">
              {cart?.items.length ? "Checkout" : "Shop products"}
            </Button>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

function EmptyCart({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
      {text}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-slate-600">
      <span>{label}</span>
      <span className="font-bold text-slate-950">{value}</span>
    </div>
  );
}
