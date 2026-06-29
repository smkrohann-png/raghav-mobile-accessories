"use client";

import { useState } from "react";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Search, Plus, Edit, Trash2, ShieldAlert } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [searchVal, setSearchVal] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  // Edit / Add modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("covers");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [desc, setDesc] = useState("");

  const handleOpenEdit = (prod: Product) => {
    setCurrentProduct(prod);
    setName(prod.name);
    setPrice(prod.price);
    setCategory(prod.category);
    setBrand(prod.brand);
    setStock(prod.stock);
    setDesc(prod.description);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setCurrentProduct(null);
    setName("");
    setPrice(0);
    setCategory("covers");
    setBrand("");
    setStock(10);
    setDesc("");
    setIsModalOpen(true);
  };

  const handleDelete = (prodId: string) => {
    if (confirm("Are you sure you want to remove this product from catalog?")) {
      setProductList((prev) => prev.filter((p) => p.id !== prodId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentProduct) {
      // Edit mode
      setProductList((prev) =>
        prev.map((p) =>
          p.id === currentProduct.id
            ? {
                ...p,
                name,
                price: Number(price),
                category,
                brand,
                stock: Number(stock),
                description: desc,
              }
            : p
        )
      );
    } else {
      // Add mode
      const newProd: Product = {
        id: `prod-${Math.random().toString(36).substr(2, 9)}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        price: Number(price),
        category,
        brand,
        stock: Number(stock),
        description: desc,
        images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80"],
        rating: 4.8,
        reviewsCount: 0,
        reviews: [],
        featured: false,
        bestSeller: false,
        newArrival: true,
        trending: false,
        colors: ["Default"],
        specifications: {},
      };
      setProductList((prev) => [newProd, ...prev]);
    }

    setIsModalOpen(false);
  };

  const filtered = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchVal.toLowerCase()) || p.brand.toLowerCase().includes(searchVal.toLowerCase());
    const matchCat = selectedCat === "" || p.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Catalog Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            Create, update stock, or remove accessories from active catalog
          </p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" className="rounded-2xl h-11 text-xs font-bold" leftIcon={<Plus size={16} />}>
          Add Product
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-5">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog by name or brand..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
        >
          <option value="">All Categories</option>
          <option value="covers">Mobile Covers</option>
          <option value="chargers">Chargers</option>
          <option value="earbuds">Earbuds</option>
          <option value="power-banks">Power Banks</option>
          <option value="cables">Cables</option>
          <option value="tempered-glass">Tempered Glass</option>
        </select>
      </div>

      {/* Products Table list */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3">Details</th>
              <th className="py-3">Brand</th>
              <th className="py-3">Category</th>
              <th className="py-3">Price</th>
              <th className="py-3">Stock Level</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod) => (
              <tr key={prod.id} className="border-b border-slate-50 font-semibold text-slate-700 hover:bg-slate-50/40">
                <td className="py-3.5 flex items-center gap-3">
                  <img src={prod.images[0]} alt={prod.name} className="h-10 w-10 object-contain rounded-lg border border-slate-100 p-1" />
                  <span className="font-bold text-slate-800 max-w-[240px] truncate">{prod.name}</span>
                </td>
                <td className="py-3.5">{prod.brand}</td>
                <td className="py-3.5 capitalize">{prod.category}</td>
                <td className="py-3.5 font-black text-slate-900">{formatPrice(prod.price)}</td>
                <td className="py-3.5">
                  {prod.stock < 60 ? (
                    <span className="text-amber-600 flex items-center gap-1">
                      <ShieldAlert size={14} />
                      {prod.stock} Units (Low)
                    </span>
                  ) : (
                    <span className="text-slate-500">{prod.stock} Units</span>
                  )}
                </td>
                <td className="py-3.5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-2 border border-slate-150 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all text-slate-500"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-2 border border-slate-150 rounded-xl hover:border-red-500 hover:text-red-500 transition-all text-slate-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentProduct ? "Modify Product Details" : "Create Product Entry"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Spigen Rugged Case"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (INR)"
              type="number"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="e.g. 999"
              required
            />
            <Input
              label="Stock Quantity"
              type="number"
              value={stock || ""}
              onChange={(e) => setStock(Number(e.target.value))}
              placeholder="e.g. 50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 text-xs font-semibold text-slate-800 outline-none focus:border-orange-500"
              >
                <option value="covers">Mobile Covers</option>
                <option value="chargers">Chargers</option>
                <option value="earbuds">Earbuds</option>
                <option value="power-banks">Power Banks</option>
                <option value="cables">Cables</option>
                <option value="tempered-glass">Tempered Glass</option>
              </select>
            </div>
            <Input
              label="Brand Name"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Spigen, Noise"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Detailed product descriptions..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-800 outline-none focus:border-orange-500"
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full rounded-2xl h-11 mt-4">
            {currentProduct ? "Save Updates" : "Add Product"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
