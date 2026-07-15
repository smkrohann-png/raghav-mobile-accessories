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
  
  // Pincode-based dynamic shipping
  const pincodePrefix = address.pincode.substring(0, 2);
  const firstDigit = address.pincode.substring(0, 1);
  
  let shippingCharge = 90; // Zone 3 (Far & Rest of India)
  
  if (["11", "12", "13", "14", "16"].includes(pincodePrefix)) {
    shippingCharge = 40; // Zone 1 (Local & Nearby: Delhi, Haryana, Punjab, Chandigarh)
  } else if (["2", "3", "4"].includes(firstDigit)) {
    shippingCharge = 60; // Zone 2 (Metro & Central: UP, Raj, MP, Guj, Mah)
  }

  // Free shipping on subtotal above ₹999 ? No, user said "remove Free Shipping on orders above 999". So we'll charge shipping on all orders or just keep it?
  // User said "remove Free Shipping on Orders Above 999", which implies we should charge delivery always, or they just wanted the text gone.
  // We'll keep the zone-based shipping for all orders.
  
  const codFee = 30; // Reduced from 49 to 30
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
