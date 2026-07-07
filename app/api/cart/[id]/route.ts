import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";

// UPDATE cart item quantity
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id: productId } = await params;
    const body = await req.json();
    const { quantity } = body;

    if (quantity < 0) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    const cart = db.getCartByUserId(session.userId);
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex((item) => item.productId === productId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock
      const product = db.getProductById(productId);
      if (product && product.stock < quantity) {
        return NextResponse.json(
          { error: "Insufficient stock" },
          { status: 400 }
        );
      }
      cart.items[itemIndex].quantity = quantity;
    }

    const updatedCart = db.updateCart(cart.id, cart);

    const items = updatedCart.items.map((item) => {
      const prod = db.getProductById(item.productId);
      return {
        ...item,
        product: prod,
      };
    });

    return NextResponse.json({
      message: "Cart updated",
      cart: {
        id: updatedCart.id,
        items,
      },
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE cart item
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id: productId } = await params;

    const cart = db.getCartByUserId(session.userId);
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex((item) => item.productId === productId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    cart.items.splice(itemIndex, 1);
    const updatedCart = db.updateCart(cart.id, cart);

    const items = updatedCart.items.map((item) => {
      const prod = db.getProductById(item.productId);
      return {
        ...item,
        product: prod,
      };
    });

    return NextResponse.json({
      message: "Item removed from cart",
      cart: {
        id: updatedCart.id,
        items,
      },
    });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
