"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  Boxes,
  Check,
  CheckCircle,
  Copy,
  ExternalLink,
  HelpCircle,
  Plus,
  Settings,
  Star,
  Tags,
  TicketPercent,
  Trash,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { categories } from "@/data/storefront";
import { formatCurrency } from "@/lib/utils";
import { useAdminStore } from "@/store/admin";
import type { Product } from "@/types/product";

const config = {
  products: {
    title: "Product management",
    icon: Boxes,
    description: "Manage all products, prices, stock and discounts.",
  },

  categories: {
    title: "Category management",
    icon: Tags,
    description: "Manage product categories.",
  },

  reviews: {
    title: "Reviews",
    icon: Star,
    description: "Approve or reject customer reviews.",
  },

  coupons: {
    title: "Coupons",
    icon: TicketPercent,
    description: "Create and manage promo codes and customer discounts.",
  },

  shiprocket: {
    title: "Shiprocket Integration",
    icon: Truck,
    description: "Manage COD courier dispatch, track Shiprocket shipments, and view credential status.",
  },

  settings: {
    title: "Settings",
    icon: Settings,
    description: "Store settings and admin account.",
  },
};

export default function AdminModulePage() {
  const params = useParams<{ section: string }>();
  const section = params.section as keyof typeof config;
  const meta = config[section] || config.products;
  const Icon = meta.icon;
  const {
    products,
    reviews,
    requests,
    settings,
    coupons,
    orders,
    fetchProducts,
    saveProduct,
    deleteProduct,
    fetchReviews,
    updateReviewStatus,
    deleteReview,
    fetchRequests,
    updateRequestStatus,
    fetchSettings,
    saveSettings,
    fetchCoupons,
    createCoupon,
    deleteCoupon,
    fetchAllOrders,
    isLoading,
    error,
  } = useAdminStore();

  const [editing, setEditing] = useState<Product | null>(null);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [saved, setSaved] = useState("");
  const [copiedText, setCopiedText] = useState("");
  const [shiprocketConfig, setShiprocketConfig] = useState<{ configured: boolean; email?: string; pickupLocation?: string } | null>(null);

  const lowStock = useMemo(() => products.filter((product) => product.stock <= 10), [products]);
  const discounted = useMemo(() => products.filter((product) => product.compareAt && product.compareAt > product.price), [products]);
  const shiprocketOrders = useMemo(() => orders.filter((order) => order.shippingProvider === "Shiprocket" || order.shiprocketAwbCode), [orders]);

  useEffect(() => {
    if (section === "products" || section === "categories" || section === "coupons" || section === "shiprocket") {
      fetchProducts();
    }
    if (section === "coupons") {
      fetchCoupons();
    }
    if (section === "shiprocket") {
      fetchAllOrders();
      fetch("/api/admin/shiprocket/status")
        .then((res) => res.json())
        .then((data) => setShiprocketConfig(data))
        .catch(console.error);
    }
    if (section === "reviews") fetchReviews();
    if (section === "settings") {
      fetchSettings();
      fetchRequests();
    }
  }, [fetchProducts, fetchRequests, fetchReviews, fetchSettings, fetchCoupons, fetchAllOrders, section]);

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await saveProduct({
      id: editing?.id,
      name: String(formData.get("name")),
      category: String(formData.get("category")),
      tag: String(formData.get("tag")),
      price: Number(formData.get("price")),
      compareAt: Number(formData.get("compareAt") || 0) || undefined,
      image: String(formData.get("image") || ""),
      sku: String(formData.get("sku") || ""),
      connector: String(formData.get("connector") || ""),
      power: String(formData.get("power") || ""),
      length: String(formData.get("length") || ""),
      stock: Number(formData.get("stock") || 0),
      compatibleBrands: String(formData.get("compatibleBrands") || "All").split(",").map((item) => item.trim()).filter(Boolean),
      color: String(formData.get("color") || "White"),
      tone: String(formData.get("tone") || "orange") as Product["tone"],
      visual: String(formData.get("visual") || "cable") as Product["visual"],
      description: String(formData.get("description") || ""),
      features: String(formData.get("features") || "").split("\n").map((item) => item.trim()).filter(Boolean),
    });
    setEditing(null);
    setProductFormOpen(false);
    setSaved("Product saved successfully.");
    setTimeout(() => setSaved(""), 3000);
  }

  const handleCopyAWB = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedText(awb);
    setTimeout(() => setCopiedText(""), 2000);
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-emerald-600">Admin module</p>
          <h1 className="mt-2 flex items-center gap-3 text-2xl font-black text-slate-950 sm:text-3xl">
            <Icon className="h-7 w-7 text-emerald-600" />
            {meta.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{meta.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {section === "products" ? (
            <Button onClick={() => { setEditing(null); setProductFormOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add product
            </Button>
          ) : null}
          {section === "products" ? <Button variant="secondary" onClick={() => window.open("/api/admin/orders/export?range=all", "_blank")}>Export Catalog</Button> : null}
        </div>
      </header>

      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p> : null}
      {saved ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{saved}</p> : null}

      {section === "products" ? (
        <>
          {productFormOpen ? (
            <ProductForm editing={editing} onSubmit={handleProductSubmit} onCancel={() => { setEditing(null); setProductFormOpen(false); }} />
          ) : null}
          <CatalogTable
            products={products}
            onEdit={(product) => { setEditing(product); setProductFormOpen(true); }}
            onDelete={deleteProduct}
          />
        </>
      ) : null}

      {section === "categories" ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const count = products.filter((product) => product.category === category.name).length;
            return (
              <article key={category.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black text-slate-950">{category.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                <p className="mt-4 text-sm font-black text-emerald-700">{count} products</p>
              </article>
            );
          })}
        </section>
      ) : null}

      {section === "reviews" ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Header title="Pending reviews" />
          <div className="grid gap-3 p-5">
            {reviews.map((review) => (
              <article key={review.id || `${review.name}-${review.product}`} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{review.name}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{review.product}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{review.rating} stars · {review.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{review.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => review.id && updateReviewStatus(review.id, "Approved")}>Approve</Button>
                  <Button size="sm" variant="ghost" onClick={() => review.id && updateReviewStatus(review.id, "Pending")}>Mark pending</Button>
                  <Button size="sm" variant="secondary" onClick={() => review.id && deleteReview(review.id)}>Delete</Button>
                </div>
              </article>
            ))}
            {!reviews.length && !isLoading ? <p className="text-sm font-semibold text-slate-500">No reviews yet.</p> : null}
          </div>
        </section>
      ) : null}

      {/* Coupons tab view */}
      {section === "coupons" ? (
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <form
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm h-fit space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              try {
                await createCoupon({
                  code: String(formData.get("code")).toUpperCase().trim(),
                  discountType: formData.get("discountType") as "percentage" | "fixed",
                  discountValue: Number(formData.get("discountValue")),
                  minOrderAmount: Number(formData.get("minOrderAmount") || 0),
                  isActive: formData.get("isActive") === "on",
                });
                event.currentTarget.reset();
                setSaved("Coupon created successfully.");
                setTimeout(() => setSaved(""), 3000);
              } catch {
                // error handled by store state
              }
            }}
          >
            <Header title="Create New Coupon" />
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Coupon Code</label>
                <Input name="code" placeholder="e.g. RAGHAV50" required className="uppercase font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Type</label>
                  <select name="discountType" required className="h-12 w-full rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold outline-none focus:border-emerald-400">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Discount Value</label>
                  <Input name="discountValue" type="number" placeholder="e.g. 10 or 100" required min={1} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Minimum Order Amount (₹)</label>
                <Input name="minOrderAmount" type="number" placeholder="e.g. 499" defaultValue={0} min={0} />
              </div>
              <label className="flex items-center gap-3 text-sm font-bold text-slate-700 pt-2">
                <input name="isActive" type="checkbox" defaultChecked className="accent-emerald-600 h-4 w-4" />
                Activate coupon instantly
              </label>
              <Button type="submit" disabled={isLoading} className="w-full">Create Coupon</Button>
            </div>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <Header title="Active Coupons List" />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="px-5 py-3.5">Code</th>
                    <th className="px-5 py-3.5">Benefit</th>
                    <th className="px-5 py-3.5">Min Spend</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-slate-55/40 transition">
                      <td className="px-5 py-4">
                        <span className="inline-block rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-sm font-black text-emerald-700 font-mono">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-black text-slate-900">
                        {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                      </td>
                      <td className="px-5 py-4 text-slate-650">
                        ₹{coupon.minOrderAmount}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-[0.05em] ${coupon.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteCoupon(coupon.id)}
                          className="rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          aria-label="Delete coupon"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!coupons.length && !isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm font-semibold text-slate-500">
                        No coupon codes available. Create one using the form on the left!
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {/* Shiprocket Tab View */}
      {section === "shiprocket" ? (
        <div className="space-y-6">
          {/* Setup Status Panel */}
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-950 mb-2">Shiprocket Credentials Status</h3>
                <p className="text-sm text-slate-600 leading-6 mb-4">
                  Connect your Shiprocket courier API to automate order booking, AWB assignment, and dispatch notifications.
                </p>
                {shiprocketConfig?.configured ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">
                    <CheckCircle className="h-6 w-6 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-bold">Production Mode Enabled</p>
                      <p className="text-xs font-semibold opacity-90 mt-1">
                        Connected API: {shiprocketConfig.email} · Pickup: {shiprocketConfig.pickupLocation}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-850">
                    <AlertCircle className="h-6 w-6 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-bold">Simulation Mode Active</p>
                      <p className="text-xs font-semibold opacity-90 mt-1">
                        Credentials are not configured in `.env`. Orders booked via Shiprocket will generate mock AWBs instantly for risk-free sandboxed testing.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
                Mode switches automatically based on environment variables.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-950 mb-3">Sync Statistics</h3>
              <div className="space-y-3 font-semibold text-sm">
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500">Total Sync Orders</span>
                  <span className="text-slate-950 font-bold">{shiprocketOrders.length}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500">Integration Method</span>
                  <span className="text-emerald-700 font-bold">{shiprocketConfig?.configured ? "Live API" : "Simulated AWB"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipped / Synced Orders */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <Header title="Orders Dispatched via Shiprocket" />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">AWB Tracking Code</th>
                    <th className="px-5 py-3">Sync Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Track</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {shiprocketOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-4 font-mono text-slate-900 font-bold">{order.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-950">{order.customerName || order.customer}</p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{order.phone}</p>
                      </td>
                      <td className="px-5 py-4 font-mono">
                        {order.shiprocketAwbCode ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{order.shiprocketAwbCode}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyAWB(order.shiprocketAwbCode || "")}
                              className="text-slate-400 hover:text-slate-900"
                              title="Copy AWB code"
                            >
                              {copiedText === order.shiprocketAwbCode ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-semibold italic">Processing AWB...</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-black text-emerald-750">
                          {order.shippingStatus || "AWB Booked"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {order.shiprocketAwbCode ? (
                          <a
                            href={`https://shiprocket.co/tracking/${order.shiprocketAwbCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:text-emerald-800 underline"
                          >
                            Track <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                  {!shiprocketOrders.length && !isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-sm font-semibold text-slate-500">
                        No orders have been shipped via Shiprocket yet. Go to Orders page and click &quot;Ship via Shiprocket&quot; to book a shipment!
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      ) : null}

      {section === "settings" ? (
        <section className="grid gap-5 lg:grid-cols-[0.7fr_1fr]">
          <form
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              await saveSettings({
                storeName: String(formData.get("storeName")),
                email: String(formData.get("email")),
                phone: String(formData.get("phone")),
                address: String(formData.get("address")),
                codEnabled: formData.get("codEnabled") === "on",
                lowStockThreshold: Number(formData.get("lowStockThreshold") || 10),
              });
              setSaved("Settings saved.");
              setTimeout(() => setSaved(""), 3000);
            }}
          >
            <Header title="Store settings" />
            <div className="grid gap-4 p-1 pt-5">
              <Input name="storeName" placeholder="Store name" defaultValue={settings?.storeName} />
              <Input name="email" placeholder="Admin email" defaultValue={settings?.email} />
              <Input name="phone" placeholder="Phone" defaultValue={settings?.phone} />
              <textarea name="address" className="min-h-24 rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Address" defaultValue={settings?.address} />
              <Input name="lowStockThreshold" type="number" placeholder="Low stock threshold" defaultValue={settings?.lowStockThreshold || 10} />
              <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <input name="codEnabled" type="checkbox" defaultChecked={settings?.codEnabled ?? true} className="accent-emerald-600" />
                Cash On Delivery enabled
              </label>
              <Button disabled={isLoading}>Save settings</Button>
            </div>
          </form>
          <RequestsPanel requests={requests} onStatus={updateRequestStatus} />
        </section>
      ) : null}

      {[
        "categories",
        "reviews",
        "settings",
      ].includes(section) ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Products" value={String(products.length)} />
          <Metric label="Low stock" value={String(lowStock.length)} />
          <Metric label="Active discounts" value={String(discounted.length)} />
          <Metric label="Catalog value" value={formatCurrency(products.reduce((sum, product) => sum + product.price * product.stock, 0))} />
        </section>
      ) : null}
    </div>
  );
}

function ProductForm({
  editing,
  onSubmit,
  onCancel,
}: {
  editing: Product | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <Header title={editing ? "Edit product" : "Add product"} />
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        <Input name="name" placeholder="Product name" defaultValue={editing?.name} required />
        <select
          name="category"
          className="flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          defaultValue={editing?.category || "Data Cables"}
          required
        >
          <option value="Data Cables">Data Cables</option>
          <option value="Chargers">Chargers</option>
          <option value="Earphones">Earphones</option>
          <option value="Earbuds">Earbuds</option>
          <option value="Neckbands">Neckbands</option>
        </select>
        <Input name="price" placeholder="Sale price (₹)" type="number" defaultValue={editing?.price} required />
        <Input name="compareAt" placeholder="Original price (₹)" type="number" defaultValue={editing?.compareAt} />
        <Input name="stock" placeholder="Stock quantity" type="number" defaultValue={editing?.stock ?? 0} required />
        <Input name="image" placeholder="Product image URL" defaultValue={editing?.image} />
        
        {/* Hidden advanced fields that pass defaults back to the store */}
        <input type="hidden" name="sku" value={editing?.sku || ""} />
        <input type="hidden" name="tag" value={editing?.tag || "New"} />
        <input type="hidden" name="color" value={editing?.color || "White"} />
        <input type="hidden" name="compatibleBrands" value={editing?.compatibleBrands?.join(", ") || "All"} />
        <input type="hidden" name="tone" value={editing?.tone || "orange"} />
        <input type="hidden" name="visual" value={editing?.visual || "cable"} />
        <input type="hidden" name="connector" value={editing?.connector || ""} />
        <input type="hidden" name="power" value={editing?.power || ""} />
        <input type="hidden" name="length" value={editing?.length || ""} />
        <input type="hidden" name="features" value={editing?.features?.join("\n") || ""} />

        <div className="md:col-span-2 xl:col-span-2">
          <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Product description..."
            defaultValue={editing?.description}
            className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            rows={4}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button type="submit">Save product</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function CatalogTable({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Header title="Catalog products" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Connector/Spec</th>
              <th className="px-4 py-3">Power/Spec</th>
              <th className="px-4 py-3">Original price</th>
              <th className="px-4 py-3">Sale price</th>
              <th className="px-4 py-3">Savings</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold">
            {products.map((product) => {
              const savings = product.compareAt ? product.compareAt - product.price : 0;
              const discount = product.compareAt ? Math.round((savings / product.compareAt) * 100) : 0;
              return (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-black text-slate-950">{product.name}</td>
                  <td className="px-4 py-4 font-semibold text-slate-650">{product.sku ?? "-"}</td>
                  <td className="px-4 py-4 font-semibold text-slate-700">{product.category}</td>
                  <td className="px-4 py-4 text-slate-650">{product.connector ?? "-"}</td>
                  <td className="px-4 py-4 text-slate-650">{product.power ?? "-"}</td>
                  <td className="px-4 py-4 text-slate-500">{product.compareAt ? formatCurrency(product.compareAt) : formatCurrency(product.price)}</td>
                  <td className="px-4 py-4 font-black text-slate-950">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-4 font-bold text-emerald-700">{discount ? `${discount}% / ${formatCurrency(savings)}` : "No offer"}</td>
                  <td className="px-4 py-4 font-bold">{product.stock}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{product.tag}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={product.stock === 0 ? "rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700" : "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700"}>
                      {product.availability}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onEdit(product)}>Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(product.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RequestsPanel({
  requests,
  onStatus,
}: {
  requests: ReturnType<typeof useAdminStore.getState>["requests"];
  onStatus: (id: string, status: "New" | "In Progress" | "Closed") => void;
}) {
  const activeRequests = requests.filter(req => req.status !== "Closed");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Header title="Website messages, support and repair requests" />
      <div className="grid gap-3 p-5">
        {activeRequests.map((request) => (
          <article key={request.id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-black text-slate-950">{request.name || "Customer"} · {request.kind}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{request.email} {request.phone ? `· ${request.phone}` : ""}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{request.status}</span>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-950">{request.subject}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{request.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["New", "In Progress", "Closed"] as const).map((status) => (
                <Button key={status} size="sm" variant={request.status === status ? "secondary" : "ghost"} onClick={() => onStatus(request.id, status)}>
                  {status}
                </Button>
              ))}
            </div>
          </article>
        ))}
        {activeRequests.length === 0 ? <p className="text-sm font-semibold text-slate-500">No active website requests.</p> : null}
      </div>
    </section>
  );
}

function Header({ title }: { title: string }) {
  return <div className="border-b border-slate-200 px-5 py-4"><h2 className="text-base font-black text-slate-950">{title}</h2></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 truncate text-2xl font-black text-slate-950">{value}</p>
    </article>
  );
}
