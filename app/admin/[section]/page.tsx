"use client";

import { useMemo } from "react";
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
import { categories, products } from "@/data/storefront";
import { pendingReviews } from "@/data/reviews";
import { formatCurrency } from "@/lib/utils";

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

  const lowStock = useMemo(() => products.filter((product) => product.stock <= 10), []);
  const discounted = useMemo(() => products.filter((product) => product.compareAt && product.compareAt > product.price), []);

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
          {section === "products" ? <Button>Add product</Button> : null}
          <Button variant="secondary">Export</Button>
        </div>
      </header>

      {section === "products" ? (
        <CatalogTable section={section} />
      ) : null}

      {section === "categories" ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article key={category.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">{category.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
              <p className="mt-4 text-sm font-black text-orange-700">{category.count} products</p>
            </article>
          ))}
        </section>
      ) : null}

      {section === "reviews" ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Header title="Pending reviews" />
          <div className="grid gap-3 p-5">
            {pendingReviews.map((review) => (
              <article key={`${review.name}-${review.product}`} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{review.name}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{review.product}</p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{review.rating} stars</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{review.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm">Approve</Button>
                  <Button size="sm" variant="secondary">Reject</Button>
                  <Button size="sm" variant="ghost">Reply</Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {[
 "coupons",
 "shiprocket",
 "settings"
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

function CatalogTable({ section }: { section: string }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Header title={section === "inventory" ? "Inventory by SKU" : "Catalog products"} />
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
                </tr>
              );
            })}
          </tbody>
        </table>
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
