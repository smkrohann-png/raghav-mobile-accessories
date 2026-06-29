"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, Phone, MapPin, Plus, Trash2, ShieldCheck, Heart, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { getStoredOrders } from "@/services/mock-db";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Profile Edit fields
  const { user, isAuthenticated, updateProfile, addAddress, removeAddress } = useAuthStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  // Address creation modal fields
  const [isAddrOpen, setIsAddrOpen] = useState(false);
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrLine1, setAddrLine1] = useState("");
  const [addrLine2, setAddrLine2] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPin, setAddrPin] = useState("");

  const [orderCount, setOrderCount] = useState(0);
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, mounted]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");

      // Get count of orders
      const orders = getStoredOrders();
      const userOrders = orders.filter((o) => o.userId === user.id);
      setOrderCount(userOrders.length);
    }
  }, [user]);

  if (!mounted || !user) {
    return (
      <div className="container py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500" />
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, phone, avatar);
    alert("Profile details updated successfully!");
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrLine1 || !addrCity || !addrState || !addrPin) {
      alert("Please fill all required address fields.");
      return;
    }

    addAddress({
      name: addrName,
      phone: addrPhone,
      line1: addrLine1,
      line2: addrLine2,
      city: addrCity,
      state: addrState,
      pincode: addrPin,
      country: "India",
    });

    setIsAddrOpen(false);
    // Reset modal fields
    setAddrName("");
    setAddrPhone("");
    setAddrLine1("");
    setAddrLine2("");
    setAddrCity("");
    setAddrState("");
    setAddrPin("");
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">My Account</h1>

      {/* Account stats cards */}
      <div className="grid gap-6 sm:grid-cols-3 mb-10">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{orderCount}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Total Orders</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Heart size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{wishlistItems.length}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Shortlisted Items</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 capitalize">{user.role} Account</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Role Type</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Left: Saved Addresses & Profile form */}
        <div className="flex flex-col gap-8">
          {/* Profile Form */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <UserIcon size={16} className="text-orange-500" />
              Profile Details
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                />
                <Input
                  label="Email Address"
                  value={user.email}
                  disabled
                  type="email"
                  helperText="Primary email cannot be changed"
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile number"
                />
                <Input
                  label="Avatar Link (Optional)"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://image-url.com"
                />
              </div>

              <Button type="submit" variant="primary" className="rounded-xl h-10 text-xs font-bold px-5">
                Save Updates
              </Button>
            </form>
          </div>

          {/* Addresses list */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={16} className="text-orange-500" />
                Shipping Addresses
              </h3>
              <button
                onClick={() => setIsAddrOpen(true)}
                className="text-xs font-bold text-orange-500 hover:text-orange-650 flex items-center gap-1 transition"
              >
                <Plus size={14} />
                Add New
              </button>
            </div>

            {user.addresses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-100 p-4 relative group hover:border-orange-200 transition">
                    <button
                      onClick={() => removeAddress(idx)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-xs font-bold text-slate-800">{addr.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{addr.phone}</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2.5">
                      {addr.line1}, {addr.line2 ? `${addr.line2}, ` : ""}
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-semibold text-center py-6">No shipping addresses saved yet.</p>
            )}
          </div>
        </div>

        {/* Right side menu options */}
        <div className="flex flex-col gap-6 h-fit">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link href="/orders">
                <Button variant="outline" className="w-full rounded-2xl justify-start text-xs font-bold h-11">
                  📦 View Order History
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="outline" className="w-full rounded-2xl justify-start text-xs font-bold h-11">
                  💖 View Wishlist
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" className="w-full rounded-2xl justify-start text-xs font-bold h-11">
                  🛒 Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Create Address Modal */}
      <Modal isOpen={isAddrOpen} onClose={() => setIsAddrOpen(false)} title="Add Shipping Address" size="md">
        <form onSubmit={handleCreateAddress} className="space-y-4">
          <Input
            label="Recipient Name"
            value={addrName}
            onChange={(e) => setAddrName(e.target.value)}
            placeholder="Name"
            required
          />
          <Input
            label="Recipient Phone"
            value={addrPhone}
            onChange={(e) => setAddrPhone(e.target.value)}
            placeholder="Mobile phone"
            required
          />
          <Input
            label="Address Line 1"
            value={addrLine1}
            onChange={(e) => setAddrLine1(e.target.value)}
            placeholder="Flat, House no., Building"
            required
          />
          <Input
            label="Address Line 2 (Optional)"
            value={addrLine2}
            onChange={(e) => setAddrLine2(e.target.value)}
            placeholder="Street, Area, Sector"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={addrCity}
              onChange={(e) => setAddrCity(e.target.value)}
              placeholder="City"
              required
            />
            <Input
              label="State"
              value={addrState}
              onChange={(e) => setAddrState(e.target.value)}
              placeholder="State"
              required
            />
          </div>
          <Input
            label="Pincode"
            value={addrPin}
            onChange={(e) => setAddrPin(e.target.value)}
            placeholder="6 digit PIN code"
            required
          />

          <Button type="submit" variant="primary" className="w-full rounded-2xl h-11 mt-4">
            Save Address
          </Button>
        </form>
      </Modal>
    </div>
  );
}
