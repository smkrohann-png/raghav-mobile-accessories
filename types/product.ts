import type { LucideIcon } from "lucide-react";

export type ProductVisualTone =
  | "orange"
  | "navy"
  | "silver"
  | "mint"
  | "violet"
  | "graphite";

export type Product = {
  id: string;
  name: string;
  category: string;
  tag: string;
  price: number;
  compareAt?: number;
  image?: string;
  sku?: string;
  connector?: string;
  power?: string;
  length?: string;
  rating: number;
  reviews: number;
  stock: number;
  availability: "In stock" | "Low stock" | "Pre-order";
  compatibleBrands: string[];
  color: string;
  tone: ProductVisualTone;
  visual: "case" | "charger" | "earbuds" | "powerbank" | "glass" | "stand" | "cable";
  description: string;
  features: string[];
};

export type Category = {
  name: string;
  slug: string;
  count: number;
  description: string;
  tone: ProductVisualTone;
  icon: LucideIcon;
};
