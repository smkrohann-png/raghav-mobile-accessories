import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";

// GET user's cart
export async function GET(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    let cart = await db.getCartByUserId(session.userId);
    if (!cart) {
      cart = await db.createCart(session.userId);
    }

    // Map product IDs to full product details
    const items = cart.items.map(async (item) => {
      const product = await db.getProductById(item.productId);
      return {
        ...item,
        product,
      };
    });

    return NextResponse.json({
      id: cart.id,
      userId: cart.userId,
      items,
      updatedAt: cart.updatedAt,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// ADD item to cart
export async function POST(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId, quantity } = body;

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid product or quantity" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await db.getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    let cart = await db.getCartByUserId(session.userId);
    if (!cart) {
      cart = await db.createCart(session.userId);
    }

    // Add or update item
    const existingItem = cart.items.find((item) => item.productId === productId);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: "Insufficient stock for requested quantity" },
          { status: 400 }
        );
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        addedAt: new Date(),
      });
    }

    const updatedCart = await db.updateCart(cart.id, cart);

    const items = updatedCart.items.map(async (item) => {
      const prod = await db.getProductById(item.productId);
      return {
        ...item,
        product: prod,
      };
    });

    return NextResponse.json({
      message: "Item added to cart",
      cart: {
        id: updatedCart.id,
        items,
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
