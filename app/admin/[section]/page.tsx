"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Boxes,
  Settings,
  Star,
  Tags,
  TicketPercent,
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
    description: "Create and manage coupons.",
  },

  shiprocket: {
    title: "Shiprocket",
    icon: Truck,
    description: "View COD courier readiness and Shiprocket shipment details.",
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
    fetchProducts,
    saveProduct,
    deleteProduct,
    fetchReviews,
    updateReviewStatus,
    fetchRequests,
    updateRequestStatus,
    fetchSettings,
    saveSettings,
    isLoading,
    error,
  } = useAdminStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [saved, setSaved] = useState("");

  const lowStock = useMemo(() => products.filter((product) => product.stock <= 10), [products]);
  const discounted = useMemo(() => products.filter((product) => product.compareAt && product.compareAt > product.price), [products]);

  useEffect(() => {
    if (section === "products" || section === "categories" || section === "coupons" || section === "shiprocket") fetchProducts();
    if (section === "reviews") fetchReviews();
    if (section === "settings") {
      fetchSettings();
      fetchRequests();
    }
  }, [fetchProducts, fetchRequests, fetchReviews, fetchSettings, section]);

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
    setSaved("Product saved.");
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-orange-600">Admin module</p>
          <h1 className="mt-2 flex items-center gap-3 text-2xl font-black text-slate-950 sm:text-3xl">
            <Icon className="h-7 w-7 text-orange-600" />
            {meta.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{meta.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {section === "products" ? (
            <Button onClick={() => { setEditing(null); setProductFormOpen(true); }}>Add product</Button>
          ) : null}
          {section === "products" ? <Button variant="secondary" onClick={() => window.open("/api/admin/orders/export?range=all", "_blank")}>Export</Button> : null}
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
              <p className="mt-4 text-sm font-black text-orange-700">{count} products</p>
            </article>
          )})}
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
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{review.rating} stars · {review.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{review.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => review.id && updateReviewStatus(review.id, "Approved")}>Approve</Button>
                  <Button size="sm" variant="secondary" onClick={() => review.id && updateReviewStatus(review.id, "Rejected")}>Reject</Button>
                  <Button size="sm" variant="ghost" onClick={() => review.id && updateReviewStatus(review.id, "Pending")}>Mark pending</Button>
                </div>
              </article>
            ))}
            {!reviews.length && !isLoading ? <p className="text-sm font-semibold text-slate-500">No reviews yet.</p> : null}
          </div>
        </section>
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
            }}
          >
            <Header title="Store settings" />
            <div className="grid gap-4 p-1 pt-5">
              <Input name="storeName" placeholder="Store name" defaultValue={settings?.storeName} />
              <Input name="email" placeholder="Admin email" defaultValue={settings?.email} />
              <Input name="phone" placeholder="Phone" defaultValue={settings?.phone} />
              <textarea name="address" className="min-h-24 rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" placeholder="Address" defaultValue={settings?.address} />
              <Input name="lowStockThreshold" type="number" placeholder="Low stock threshold" defaultValue={settings?.lowStockThreshold || 10} />
              <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <input name="codEnabled" type="checkbox" defaultChecked={settings?.codEnabled ?? true} className="accent-orange-600" />
                Cash On Delivery enabled
              </label>
              <Button disabled={isLoading}>Save settings</Button>
            </div>
          </form>
          <RequestsPanel requests={requests} onStatus={updateRequestStatus} />
        </section>
      ) : null}

      {[
 "coupons",
 "shiprocket"
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
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Input name="name" placeholder="Product name" defaultValue={editing?.name} required />
        <Input name="category" placeholder="Category" defaultValue={editing?.category || "Data Cables"} required />
        <Input name="sku" placeholder="SKU" defaultValue={editing?.sku} />
        <Input name="price" placeholder="Sale price" type="number" defaultValue={editing?.price} required />
        <Input name="compareAt" placeholder="Original price" type="number" defaultValue={editing?.compareAt} />
        <Input name="stock" placeholder="Stock" type="number" defaultValue={editing?.stock ?? 0} required />
        <Input name="image" placeholder="Product image URL" defaultValue={editing?.image} />
        <Input name="tag" placeholder="Tag" defaultValue={editing?.tag || "New"} />
        <Input name="connector" placeholder="Connector" defaultValue={editing?.connector} />
        <Input name="power" placeholder="Power" defaultValue={editing?.power} />
        <Input name="length" placeholder="Length" defaultValue={editing?.length} />
        <Input name="color" placeholder="Color" defaultValue={editing?.color || "White"} />
        <Input name="compatibleBrands" placeholder="Compatible brands comma separated" defaultValue={editing?.compatibleBrands.join(", ")} />
        <select name="tone" defaultValue={editing?.tone || "orange"} className="h-12 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold outline-none">
          {["orange", "navy", "silver", "mint", "violet", "graphite"].map((tone) => <option key={tone}>{tone}</option>)}
        </select>
        <select name="visual" defaultValue={editing?.visual || "cable"} className="h-12 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold outline-none">
          {["case", "charger", "earbuds", "powerbank", "glass", "stand", "cable"].map((visual) => <option key={visual}>{visual}</option>)}
        </select>
      </div>
      <textarea name="description" className="mt-4 min-h-24 w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" placeholder="Description" defaultValue={editing?.description} />
      <textarea name="features" className="mt-4 min-h-24 w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" placeholder="One feature per line" defaultValue={editing?.features.join("\n")} />
      <div className="mt-5 flex flex-wrap gap-2">
        <Button type="submit">Save product</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
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
              <th className="px-4 py-3">Connector</th>
              <th className="px-4 py-3">Power</th>
              <th className="px-4 py-3">Original price</th>
              <th className="px-4 py-3">Sale price</th>
              <th className="px-4 py-3">Savings</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const savings = product.compareAt ? product.compareAt - product.price : 0;
              const discount = product.compareAt ? Math.round((savings / product.compareAt) * 100) : 0;
              return (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-black text-slate-950">{product.name}</td>
                  <td className="px-4 py-4 font-semibold text-slate-600">{product.sku ?? "-"}</td>
                  <td className="px-4 py-4 font-semibold text-slate-700">{product.category}</td>
                  <td className="px-4 py-4">{product.connector ?? "-"}</td>
                  <td className="px-4 py-4">{product.power ?? "-"}</td>
                  <td className="px-4 py-4">{product.compareAt ? formatCurrency(product.compareAt) : formatCurrency(product.price)}</td>
                  <td className="px-4 py-4 font-black">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-4 font-bold text-emerald-700">{discount ? `${discount}% / ${formatCurrency(savings)}` : "No offer"}</td>
                  <td className="px-4 py-4 font-bold">{product.stock}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{product.tag}</span>
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
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Header title="Website messages, support and repair requests" />
      <div className="grid gap-3 p-5">
        {requests.map((request) => (
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
        {!requests.length ? <p className="text-sm font-semibold text-slate-500">No website requests yet.</p> : null}
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
