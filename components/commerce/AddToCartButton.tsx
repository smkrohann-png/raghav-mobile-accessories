"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";

export function AddToCartButton({
  productId,
  size = "md",
  className,
  redirectToCart = true,
}: {
  productId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  redirectToCart?: boolean;
}) {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { addToCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    setIsAdding(true);
    try {
      await checkAuth();
      if (!useAuthStore.getState().isAuthenticated && !isAuthenticated) {
        router.push("/login");
        return;
      }
      await addToCart(productId, 1);
      setAdded(true);
      if (redirectToCart) {
        router.push("/cart");
      } else {
        window.setTimeout(() => setAdded(false), 1600);
      }
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Button type="button" size={size} onClick={handleAdd} disabled={isAdding} className={className}>
      <ShoppingBag className="h-4 w-4" />
      {isAdding ? "Adding..." : added ? "Added" : "Add to cart"}
    </Button>
  );
}
