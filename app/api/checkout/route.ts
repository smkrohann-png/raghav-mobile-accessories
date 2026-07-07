import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";
import { statusMessages } from "@/data/commerce";

export async function POST(req: Request) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = db.getUserById(session.userId);
  const cart = db.getCartByUserId(session.userId);
  if (!user || !cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const { addressId } = await req.json();
  const address = db.getAddressById(addressId);
  if (!address || address.userId !== session.userId) {
    return NextResponse.json({ error: "Delivery address not found" }, { status: 404 });
  }

  const lineItems = cart.items
    .map((item) => {
      const product = db.getProductById(item.productId);
      return product ? Array.from({ length: item.quantity }, () => product) : [];
    })
    .flat();
  const subtotal = lineItems.reduce((sum, product) => sum + product.price, 0);
  const delivery = subtotal > 0 && subtotal < 3000 ? 99 : 0;
  const amount = subtotal + delivery;

  const order = db.createOrder({
    customer: session.userId,
    customerName: `${user.firstName} ${user.lastName}`,
    customerEmail: user.email,
    phone: address.phone,
    address: `${address.fullName}, ${address.street}, ${address.city}, ${address.state} ${address.pincode}`,
    date: new Date().toISOString(),
    amount,
    status: "Pending",
    paymentMethod: "Cash On Delivery",
    paymentStatus: "Pending Payment",
    shippingStatus: "Not Configured",
    products: lineItems,
    messages: [{ status: "Pending", text: statusMessages.Pending, time: new Date().toISOString() }],
  });

  db.updateCart(cart.id, { ...cart, items: [] });
  return NextResponse.json({ order }, { status: 201 });
}
