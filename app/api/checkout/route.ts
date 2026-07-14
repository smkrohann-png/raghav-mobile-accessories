import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";
import { statusMessages } from "@/data/commerce";

export async function POST(req: Request) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = await db.getUserById(session.userId);
  const cart = await db.getCartByUserId(session.userId);
  if (!user || !cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const { addressId, couponCode } = await req.json();
  const address = await db.getAddressById(addressId);
  if (!address || address.userId !== session.userId) {
    return NextResponse.json({ error: "Delivery address not found" }, { status: 404 });
  }

  const lineItems = (await Promise.all(
    cart.items.map(async (item) => {
      const product = await db.getProductById(item.productId);
      return product ? Array.from({ length: item.quantity }, () => product) : [];
    })
  )).flat();
  const subtotal = lineItems.reduce((sum, product) => sum + product.price, 0);
  
  let discount = 0;
  if (couponCode) {
    const coupon = await db.getCouponByCode(couponCode);
    if (coupon && coupon.isActive && subtotal >= coupon.minOrderAmount) {
      if (coupon.discountType === "percentage") {
        discount = Math.round((subtotal * coupon.discountValue) / 100);
      } else {
        discount = coupon.discountValue;
      }
    }
  }
  
  // ₹99 shipping for orders under ₹999 + ₹49 flat COD fee for all orders
  const shippingCharge = subtotal > 0 && subtotal < 999 ? 99 : 0;
  const codFee = 49;
  const delivery = shippingCharge + codFee;
  const amount = subtotal - discount + delivery;

  const order = await db.createOrder({
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

  await db.updateCart(cart.id, { ...cart, items: [] });
  return NextResponse.json({ order }, { status: 201 });
}
