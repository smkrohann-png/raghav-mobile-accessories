"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HandCoins, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useProfileStore } from "@/store/profile";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";

type CheckoutResponse = {
  order: {
    id: string;
    amount: number;
    paymentMethod: "Cash On Delivery";
    shippingProvider?: "Shiprocket";
    shippingStatus?: string;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const { cart, fetchCart, getTotalPrice } = useCartStore();
  const { addresses, fetchAddresses, addAddress } = useProfileStore();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountType: "percentage" | "fixed"; discountValue: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const subtotal = getTotalPrice();
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === "percentage") {
      return Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      return appliedCoupon.discountValue;
    }
  }, [appliedCoupon, subtotal]);

  const defaultAddress = useMemo(() => addresses.find((address) => address.isDefault) || addresses[0], [addresses]);
  const effectiveAddressId = selectedAddressId || defaultAddress?.id || "";
  
  const delivery = useMemo(() => {
    if (subtotal === 0) return 0;
    
    const selectedAddress = addresses.find(a => a.id === effectiveAddressId);
    let deliveryCost = 110; // Default (South/East India)
    
    if (selectedAddress) {
      const pincode = selectedAddress.pincode;
      const prefix3 = pincode.substring(0, 3);
      const prefix2 = pincode.substring(0, 2);
      const firstDigit = pincode.substring(0, 1);
      
      if (prefix3 === "135") {
        deliveryCost = 70; // Local Yamunanagar
      } else if (prefix2 === "12" || prefix2 === "13") {
        deliveryCost = 75; // Rest of Haryana
      } else if (["11", "14", "16", "17", "20", "21", "22", "23", "24", "25", "26", "27", "28", "30", "31", "32", "33", "34"].includes(prefix2)) {
        deliveryCost = 85; // Delhi, Punjab, Chandigarh, HP, UP, Rajasthan
      } else if (["4", "5", "38", "39"].includes(firstDigit) || ["38", "39"].includes(prefix2)) {
        deliveryCost = 100; // MP, Maharashtra, Gujarat, South
      } else if (["7", "8", "9"].includes(firstDigit)) {
        deliveryCost = 120; // East, North East, J&K
      }
    }
    
    return deliveryCost;
  }, [subtotal, addresses, effectiveAddressId]);

  const total = subtotal - discount + delivery;

  useEffect(() => {
    checkAuth().then(() => {
      fetchCart();
      fetchAddresses();
    });
  }, [checkAuth, fetchAddresses, fetchCart]);

  async function handleApplyCoupon() {
    if (!couponCode) return;
    setCouponError("");
    setIsValidatingCoupon(true);
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, orderAmount: subtotal }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to validate coupon");
      }
      setAppliedCoupon(data.coupon);
    } catch (err: any) {
      setCouponError(err.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      let addressId = effectiveAddressId;

      if (!addressId) {
        await addAddress({
          fullName: String(formData.get("fullName")),
          phone: String(formData.get("phone")),
          street: String(formData.get("street")),
          city: String(formData.get("city")),
          state: String(formData.get("state")),
          pincode: String(formData.get("pincode")),
          isDefault: addresses.length === 0,
        });
        await fetchAddresses();
        const latest = useProfileStore.getState().addresses.at(-1);
        addressId = latest?.id || "";
      }

      if (!addressId) {
        throw new Error("Please add or select a delivery address");
      }

      const checkout = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId, couponCode: appliedCoupon?.code || undefined }),
      });
      const checkoutData = (await checkout.json()) as CheckoutResponse & { error?: string };

      if (!checkout.ok) {
        throw new Error(checkoutData.error || "Checkout failed");
      }

      router.push(`/checkout/success?order=${checkoutData.order.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Section muted>
      <Container>
        <SectionTitle eyebrow="Checkout" title="Complete your COD order." description="Your cart, delivery address and admin-visible order timeline are connected." />
        {!isAuthenticated ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-bold text-slate-950">Login required</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Login first so COD order and delivery updates can be attached to your account.</p>
            <Button href="/login" className="mt-5">Login to checkout</Button>
          </div>
        ) : null}
        <div className="grid gap-6 lg:grid-cols-[1fr_0.42fr]">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <PanelTitle title="Delivery address" />
            {addresses.length ? (
              <div className="grid gap-3">
                {addresses.map((address) => (
                  <label className={`block rounded-2xl border p-4 text-sm transition ${effectiveAddressId === address.id ? "border-orange-300 bg-orange-50 ring-4 ring-orange-100" : "border-slate-200"}`} key={address.id}>
                    <input className="mr-2 accent-orange-600" type="radio" name="addressId" checked={effectiveAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} />
                    <strong>{address.fullName}</strong> - {address.street}, {address.city}, {address.state} {address.pincode}
                  </label>
                ))}
              </div>
            ) : null}
            {!effectiveAddressId ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input name="fullName" placeholder="Full name" defaultValue={user ? `${user.firstName} ${user.lastName}` : ""} required />
                  <Input name="phone" placeholder="Phone" defaultValue={user?.phone || ""} required />
                </div>
                <Input name="street" placeholder="Address" required />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input name="city" placeholder="City" required />
                  <Input name="state" placeholder="State" required />
                  <Input name="pincode" placeholder="PIN code" required />
                </div>
              </>
            ) : null}
            <PanelTitle title="Payment method" />
            <div className="rounded-2xl border border-orange-300 bg-orange-50 p-4 ring-4 ring-orange-100">
              <span className="block font-bold text-slate-950">Cash On Delivery</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">Pay only when the order is delivered.</span>
            </div>
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
            <Button disabled={!cart?.items.length || isSubmitting} className="w-full sm:w-auto" size="lg">
              <HandCoins className="h-5 w-5" />
              {isSubmitting ? "Placing order..." : `Place COD order ${formatCurrency(total)}`}
            </Button>
          </form>
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Order summary</h2>
            <div className="mt-5 space-y-3">
              {cart?.items.map((item) => item.product ? (
                <div className="flex justify-between gap-4 text-sm" key={item.productId}>
                  <span className="text-slate-600">{item.product.name} x {item.quantity}</span>
                  <span className="font-bold text-slate-950">{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ) : null)}
              {!cart?.items.length ? <p className="text-sm text-slate-600">Your cart is empty.</p> : null}
            </div>

            {/* Promo Code Input */}
            <div className="mt-5 border-t border-slate-200 pt-5">
              <p className="text-sm font-bold text-slate-800 mb-2">Have a Promo Code?</p>
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-orange-50 border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-850">
                  <span>{appliedCoupon.code} applied (-₹{discount})</span>
                  <button type="button" onClick={handleRemoveCoupon} className="text-orange-600 hover:text-orange-800 text-xs font-bold underline ml-2">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 min-w-0 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none uppercase font-semibold focus:border-orange-400"
                  />
                  <button type="button" onClick={handleApplyCoupon} disabled={isValidatingCoupon || !couponCode} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50">
                    {isValidatingCoupon ? "..." : "Apply"}
                  </button>
                </div>
              )}
              {couponError ? <p className="mt-2 text-xs font-semibold text-rose-600">{couponError}</p> : null}
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              {discount > 0 ? <Row label="Coupon Discount" value={`-${formatCurrency(discount)}`} /> : null}
              <Row label="Delivery" value={delivery === 0 ? "Free" : formatCurrency(delivery)} />
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
              <span className="font-bold text-slate-950">Total</span>
              <span className="text-2xl font-black text-slate-950">{formatCurrency(total)}</span>
            </div>
            <div className="mt-6 space-y-4">
              <Trust icon={Truck} title="Fast dispatch" text="Packed from available local stock." />
              <Trust icon={ShieldCheck} title="COD only" text="No online payment is collected on the website." />
              <Trust icon={PackageCheck} title="Order tracking" text="Customer and admin see the same timeline." />
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

function PanelTitle({ title }: { title: string }) {
  return <h2 className="pt-2 text-xl font-bold text-slate-950 first:pt-0">{title}</h2>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-slate-600">
      <span>{label}</span>
      <span className="font-bold text-slate-950">{value}</span>
    </div>
  );
}

function Trust({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Truck;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block font-bold text-slate-950">{title}</span>
        <span className="block text-sm leading-6 text-slate-600">{text}</span>
      </span>
    </div>
  );
}
