"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/categories";
import { Category } from "@/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const handleOpenEdit = (cat: Category) => {
    setCurrentCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setCurrentCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleDelete = (catId: string) => {
    if (confirm("Are you sure you want to remove this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== catId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === currentCategory.id
            ? { ...c, name, slug, description }
            : c
        )
      );
    } else {
      const newCat: Category = {
        id: `cat-${Math.random().toString(36).substr(2, 9)}`,
        name,
        slug,
        description,
        icon: "Smartphone",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
      };
      setCategories((prev) => [...prev, newCat]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Categories Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            Edit active categories, descriptions, or add new device groupings
          </p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" className="rounded-2xl h-11 text-xs font-bold" leftIcon={<Plus size={16} />}>
          Add Category
        </Button>
      </div>

      {/* Grid list */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">{cat.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Slug: {cat.slug}</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">{cat.description}</p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-auto">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-150 rounded-xl text-xs font-bold text-slate-600 hover:border-orange-500 hover:text-orange-500 transition-all"
              >
                <Edit size={12} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-150 rounded-xl text-xs font-bold text-slate-650 hover:border-red-500 hover:text-red-500 transition-all"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edit / Add */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentCategory ? "Modify Category" : "Create Category"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
            }}
            placeholder="e.g. Type-C Adapters"
            required
          />
          <Input
            label="Category Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. adapters"
            required
          />
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 font-bold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a small summary..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-800 outline-none focus:border-orange-500"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full rounded-2xl h-11 mt-4">
            {currentCategory ? "Save Updates" : "Create Category"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
