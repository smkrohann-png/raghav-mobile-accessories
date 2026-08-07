import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { products } from "@/data/storefront";
import { formatCurrency } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProductVisual } from "@/components/storefront/ProductVisual";
import { ProductCard } from "@/components/storefront/ProductCard";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  return {
    title: product?.name ?? "Product",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  const related = products.filter((item) => item.id !== product.id);

  return (
    <>
      <Section className="pt-10">
        <Container>
          <Link className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600" href="/products">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1fr] lg:items-start">
            <ProductVisual product={product} hero className="min-h-[520px]" />
            <div className="lg:pt-6">
              <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl">{product.name}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{product.description}</p>
              <div className="mt-7 flex items-end gap-3">
                <p className="text-4xl font-black text-slate-950">{formatCurrency(product.price)}</p>
                {product.compareAt ? <p className="pb-1 text-lg font-semibold text-slate-400 line-through">{formatCurrency(product.compareAt)}</p> : null}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <Spec label="SKU" value={product.sku ?? product.id} />
                <Spec label="Connector" value={product.connector ?? "Universal"} />
                <Spec label="Power" value={product.power ?? "Standard"} />
                <Spec label="Length" value={product.length ?? "Standard"} />
              </div>
              <div className="mt-8">
                <h2 className="text-lg font-bold text-slate-950">Specifications</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <p className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700" key={feature}>
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-600" />
                      {feature}
                    </p>
                  ))}
                </div>
              </div>
              <div className="mt-9">
                <AddToCartButton productId={product.id} size="lg" className="!bg-orange-600 !text-white hover:!bg-orange-700" />
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <Section muted>
        <Container>
          <h2 className="mb-8 text-3xl font-bold text-slate-950">More products</h2>
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard product={item} key={item.id} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}
