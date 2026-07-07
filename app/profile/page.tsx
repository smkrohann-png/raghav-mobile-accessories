"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, MapPin, PackageCheck, ShoppingBag, UserRound } from "lucide-react";

import { StatusBadge } from "@/components/commerce/OrderTimeline";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useProfileStore } from "@/store/profile";
import { formatCurrency } from "@/lib/utils";
import type { Address } from "@/types/auth";
import type { CustomerOrder } from "@/types/commerce";

type ProfileTab = "profile" | "orders" | "addresses" | "cart";

const navItems: { label: string; value: ProfileTab | "logout"; icon: typeof UserRound }[] = [
  { label: "Profile", value: "profile", icon: UserRound },
  { label: "Saved Address", value: "addresses", icon: MapPin },
  { label: "Cart", value: "cart", icon: ShoppingBag },
  { label: "Orders Status", value: "orders", icon: PackageCheck },
  { label: "Logout", value: "logout", icon: LogOut },
];

const emptyAddress = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: true,
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const { user, isAuthenticated, isLoading: authLoading, checkAuth, logout } = useAuthStore();
  const { profile, addresses, orders, fetchProfile, updateProfile, addAddress, updateAddress, isLoading, error } = useProfileStore();
  const { cart, fetchCart, getTotalItems, getTotalPrice } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (user.role === "admin") {
      router.replace("/admin");
      return;
    }
    fetchProfile();
    fetchCart();
  }, [fetchCart, fetchProfile, isAuthenticated, router, user]);

  const activeOrder = useMemo(
    () => orders.find((order) => order.status !== "Delivered" && order.status !== "Cancelled") || orders[0],
    [orders],
  );
  const totalSpent = useMemo(() => orders.reduce((sum, order) => sum + order.amount, 0), [orders]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (authLoading) {
    return (
      <Section muted>
        <Container className="max-w-2xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-600 shadow-sm">
            Checking account...
          </div>
        </Container>
      </Section>
    );
  }
if (!isAuthenticated || !user) {
  router.replace("/login");
  return null;
}

  return (
    <Section muted>
      <Container>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <p className="text-sm font-semibold text-slate-300">Customer account</p>
              <h1 className="mt-2 text-2xl font-black">{profile ? `${profile.firstName} ${profile.lastName}` : `${user.firstName} ${user.lastName}`}</h1>
              <p className="mt-2 text-sm text-slate-400">{profile?.username ? `@${profile.username}` : profile?.email || user.email}</p>
            </div>
            <div className="mt-3 grid gap-1">
              {navItems.map(({ label, value, icon: Icon }) => (
                <button
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${activeTab === value ? "bg-orange-50 text-orange-700" : "text-slate-700 hover:bg-slate-50"}`}
                  key={label}
                  onClick={() => {
                    if (value === "logout") {
                      handleLogout();
                    } else {
                      setActiveTab(value);
                    }
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </aside>
          <div className="space-y-6">
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric label="Active order" value={activeOrder?.id || "No orders"} />
              <Metric label="Cart items" value={String(getTotalItems())} />
              <Metric label="Total orders value" value={formatCurrency(totalSpent)} />
            </div>
            {activeTab === "profile" && profile ? <ProfilePanel isLoading={isLoading} onSave={updateProfile} refresh={checkAuth} profile={profile} /> : null}
            {activeTab === "addresses" ? <AddressPanel addresses={addresses} profileName={`${user.firstName} ${user.lastName}`} phone={user.phone} isLoading={isLoading} addAddress={addAddress} updateAddress={updateAddress} /> : null}
            {activeTab === "cart" ? <CartPanel items={cart?.items || []} total={getTotalPrice()} /> : null}
            {activeTab === "orders" ? <OrdersPanel orders={orders} /> : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ProfilePanel({
  profile,
  isLoading,
  onSave,
  refresh,
}: {
  profile: NonNullable<ReturnType<typeof useProfileStore.getState>["profile"]>;
  isLoading: boolean;
  onSave: (data: { username?: string; firstName?: string; lastName?: string; email?: string; phone?: string }) => Promise<void>;
  refresh: () => Promise<void>;
}) {
  const [saved, setSaved] = useState(false);

  async function saveProfile(formData: FormData) {
    setSaved(false);
    await onSave({
      username: String(formData.get("username")),
      firstName: String(formData.get("firstName")),
      lastName: String(formData.get("lastName")),
      email: String(formData.get("email")),
      phone: String(formData.get("phone")),
    });
    await refresh();
    setSaved(true);
  }

  return (
    <form action={saveProfile} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-2xl font-black text-slate-950">Profile details</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input name="username" defaultValue={profile.username || ""} placeholder="Username" required />
        <Input name="email" defaultValue={profile.email} placeholder="Email address" required type="email" />
        <Input name="firstName" defaultValue={profile.firstName} placeholder="First name" required />
        <Input name="lastName" defaultValue={profile.lastName} placeholder="Last name" required />
        <Input name="phone" defaultValue={profile.phone} placeholder="Phone number" required inputMode="numeric" />
      </div>
      <Button className="mt-5" disabled={isLoading} type="submit">{isLoading ? "Saving..." : "Save profile"}</Button>
      {saved ? <p className="mt-4 text-sm font-semibold text-emerald-700">Profile saved.</p> : null}
    </form>
  );
}

function AddressPanel({
  addresses,
  profileName,
  phone,
  isLoading,
  addAddress,
  updateAddress,
}: {
  addresses: Address[];
  profileName: string;
  phone: string;
  isLoading: boolean;
  addAddress: (data: Omit<Address, "id" | "userId" | "createdAt">) => Promise<void>;
  updateAddress: (id: string, data: Partial<Omit<Address, "id" | "userId" | "createdAt">>) => Promise<void>;
}) {
  const primary = addresses[0];
  const values = primary || { ...emptyAddress, fullName: profileName, phone };
  const [saved, setSaved] = useState(false);

  async function saveAddress(formData: FormData) {
    setSaved(false);
    const payload = {
      fullName: String(formData.get("fullName")),
      phone: String(formData.get("phone")),
      street: String(formData.get("street")),
      city: String(formData.get("city")),
      state: String(formData.get("state")),
      pincode: String(formData.get("pincode")),
      isDefault: true,
    };

    if (primary) {
      await updateAddress(primary.id, payload);
    } else {
      await addAddress(payload);
    }
    setSaved(true);
  }

  return (
    <form action={saveAddress} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-2xl font-black text-slate-950">Saved address</h2>
      <div className="mt-5 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="fullName" defaultValue={values.fullName} placeholder="Full name" required />
          <Input name="phone" defaultValue={values.phone} placeholder="Phone number" required inputMode="numeric" />
        </div>
        <Input name="street" defaultValue={values.street} placeholder="House, street, landmark" required />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input name="city" defaultValue={values.city} placeholder="City" required />
          <Input name="state" defaultValue={values.state} placeholder="State" required />
          <Input name="pincode" defaultValue={values.pincode} placeholder="Pincode" required inputMode="numeric" />
        </div>
      </div>
      <Button className="mt-5" disabled={isLoading} type="submit">{isLoading ? "Saving..." : "Save address"}</Button>
      {saved ? <p className="mt-4 text-sm font-semibold text-emerald-700">Address saved.</p> : null}
    </form>
  );
}

function CartPanel({ items, total }: { items: NonNullable<ReturnType<typeof useCartStore.getState>["cart"]>["items"]; total: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-slate-950">Cart</h2>
        <p className="text-lg font-black text-slate-950">{formatCurrency(total)}</p>
      </div>
      <div className="mt-5 grid gap-3">
        {!items.length ? <p className="text-sm font-semibold text-slate-500">Cart empty hai.</p> : null}
        {items.map((item) => (
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4" key={item.productId}>
            <div>
              <p className="font-bold text-slate-950">{item.product?.name || item.productId}</p>
              <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-black text-slate-950">{formatCurrency((item.product?.price || 0) * item.quantity)}</p>
          </div>
        ))}
      </div>
      <Button className="bg-orange-600 hover:bg-orange-500 !text-white">
  <span className="!text-white">Open cart</span>
</Button>
    </div>
  );
}

function OrdersPanel({ orders }: { orders: CustomerOrder[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-2xl font-black text-slate-950">Orders status</h2>
      <div className="mt-5 grid gap-4">
        {!orders.length ? <p className="text-sm font-semibold text-slate-500">Abhi koi order nahi hai.</p> : null}
        {orders.map((order) => (
          <article className="rounded-2xl border border-slate-100 p-4" key={order.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-950">{order.id}</h3>
                <p className="mt-1 text-sm text-slate-500">{order.products.map((product) => product.name).join(", ")}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <Info label="Total" value={formatCurrency(order.amount)} />
              <Info label="Payment" value={order.paymentMethod} />
              <Info label="Date" value={new Date(order.date).toLocaleDateString()} />
            </div>
            {order.shippingProvider ? (
              <p className="mt-3 text-sm font-semibold text-slate-500">
                Courier: {order.shippingProvider} - {order.shippingStatus || "Pending"}
              </p>
            ) : null}
            {order.messages.at(-1) ? <p className="mt-4 text-sm font-semibold text-slate-600">{order.messages.at(-1)?.text}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 font-semibold leading-6 text-slate-800">{value}</p>
    </div>
  );
}
