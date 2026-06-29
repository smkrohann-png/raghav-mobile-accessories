"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { formatPrice } from "@/lib/utils";
import { openRazorpayCheckout } from "@/services/razorpay";
import { createShiprocketOrder } from "@/services/shiprocket";
import { saveStoredOrder } from "@/services/mock-db";
import { Address, Order, OrderItem } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [shippingMethod, setShippingMethod] = useState("Standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("razorpay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { items, coupon, clearCart, getTotals } = useCartStore();
  const { user } = useAuthStore();
  const { subtotal, discount, shipping, total } = getTotals();

  // Shipping Adjustment
  const shippingCharge = shippingMethod === "Express" ? shipping + 50 : shipping;
  const grandTotal = total + (shippingMethod === "Express" && shipping === 0 ? 50 : 0);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      if (user.addresses.length > 0) {
        const addr = user.addresses[0];
        setLine1(addr.line1);
        setLine2(addr.line2 || "");
        setCity(addr.city);
        setState(addr.state);
        setPincode(addr.pincode);
      }
    }
  }, [user]);

  if (!mounted) {
    return (
      <div className="container py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-2">Add accessories to your cart before checking out.</p>
        <Button onClick={() => router.push("/shop")} className="mt-6 rounded-full">
          Back to Shop
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !phone || !line1 || !city || !state || !pincode) {
      setErrorMsg("Please complete all shipping address fields.");
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: Address = {
      name,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      country: "India",
    };

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
      color: item.selectedColor,
    }));

    const finalOrderId = `ord_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare complete Razorpay integration
    if (paymentMethod === "razorpay") {
      try {
        await openRazorpayCheckout({
          amount: grandTotal,
          email: user?.email || "customer@example.com",
          phone: phone,
          userName: name,
          onSuccess: async (paymentId) => {
            // Shiprocket Integration
            const srRes = await createShiprocketOrder({
              orderId: finalOrderId,
              orderDate: new Date().toISOString(),
              items: orderItems,
              shippingAddress,
              totalAmount: grandTotal,
            });

            const newOrder: Order = {
              id: finalOrderId,
              userId: user?.id || "guest",
              items: orderItems,
              shippingAddress,
              paymentMethod: "razorpay",
              paymentStatus: "paid",
              paymentId,
              shippingMethod,
              shippingCharge,
              discount,
              subtotal,
              total: grandTotal,
              status: "processing",
              shiprocketId: srRes.shiprocketOrderId,
              trackingNumber: srRes.awbNumber,
              createdAt: new Date().toISOString(),
            };

            saveStoredOrder(newOrder);
            clearCart();
            setIsSubmitting(false);
            router.push(`/checkout/success?id=${finalOrderId}`);
          },
          onFailure: (error) => {
            setErrorMsg(error || "Payment transaction failed.");
            setIsSubmitting(false);
          },
        });
      } catch (err: any) {
        setErrorMsg(err.message || "Something went wrong opening Razorpay checkout.");
        setIsSubmitting(false);
      }
    } else {
      // Cash on Delivery
      try {
        const srRes = await createShiprocketOrder({
          orderId: finalOrderId,
          orderDate: new Date().toISOString(),
          items: orderItems,
          shippingAddress,
          totalAmount: grandTotal,
        });

        const newOrder: Order = {
          id: finalOrderId,
          userId: user?.id || "guest",
          items: orderItems,
          shippingAddress,
          paymentMethod: "cod",
          paymentStatus: "pending",
          shippingMethod,
          shippingCharge,
          discount,
          subtotal,
          total: grandTotal,
          status: "pending",
          shiprocketId: srRes.shiprocketOrderId,
          trackingNumber: srRes.awbNumber,
          createdAt: new Date().toISOString(),
        };

        saveStoredOrder(newOrder);
        clearCart();
        setIsSubmitting(false);
        router.push(`/checkout/success?id=${finalOrderId}`);
      } catch (err: any) {
        setErrorMsg("Failed to generate cash-on-delivery order receipt.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Checkout Details</h1>

      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Shipping Form */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <Truck size={16} className="text-orange-500" />
              Shipping Address
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Receiver name"
                required
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile number"
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Address Line 1"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="Flat, House no., Building, Company"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Address Line 2 (Optional)"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  placeholder="Area, Street, Sector, Village"
                />
              </div>
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City Name"
                required
              />
              <Input
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State Name"
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="6 digit PIN code"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5">
              Delivery Method
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                  shippingMethod === "Standard" ? "border-orange-500 bg-orange-50/10" : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value="Standard"
                  checked={shippingMethod === "Standard"}
                  onChange={() => setShippingMethod("Standard")}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Standard Delivery</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">3-5 days delivery (FREE above ₹499)</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                  shippingMethod === "Express" ? "border-orange-500 bg-orange-50/10" : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value="Express"
                  checked={shippingMethod === "Express"}
                  onChange={() => setShippingMethod("Express")}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Express Delivery</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">1-2 days delivery (+₹50)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <CreditCard size={16} className="text-orange-500" />
              Select Payment Method
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMethod === "razorpay" ? "border-orange-500 bg-orange-50/10" : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Online Payment (Razorpay)</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Pay via UPI, Cards, Netbanking instantly</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMethod === "cod" ? "border-orange-500 bg-orange-50/10" : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Cash on Delivery (COD)</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Pay in cash when delivered (+₹30 fee)</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Checkout Order Summary */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-fit">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5">
            Order Summary
          </h3>

          {/* Items Summary list */}
          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto mb-5 pr-1">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-3 py-3 items-center">
                <img src={item.product.images[0]} alt={item.product.name} className="h-10 w-10 object-contain rounded-lg border border-slate-100 p-1" />
                <div className="flex-grow text-[11px] font-bold text-slate-700 min-w-0">
                  <p className="truncate">{item.product.name}</p>
                  <p className="text-[9px] text-slate-400 uppercase mt-0.5">Qty: {item.quantity} • {item.selectedColor}</p>
                </div>
                <span className="text-xs font-black text-slate-900 flex-shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-b border-slate-100 py-4 mb-5 text-xs font-semibold text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-800">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Coupon Discount</span>
              <span>-{formatPrice(discount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping cost</span>
              <span className="text-slate-800">
                {shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline mb-6">
            <span className="text-sm font-bold text-slate-800">Final Price</span>
            <span className="text-xl font-black text-orange-500">{formatPrice(grandTotal)}</span>
          </div>

          {errorMsg && <p className="mb-4 text-xs font-bold text-red-500">{errorMsg}</p>}

          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-2xl h-12 font-bold shadow-md shadow-orange-55"
            isLoading={isSubmitting}
          >
            {paymentMethod === "razorpay" ? "Pay & Confirm Order" : "Confirm COD Order"}
          </Button>

          <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-bold text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Secure Checkout Protected</span>
          </div>
        </div>
      </form>
    </div>
  );
}
