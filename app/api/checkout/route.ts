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
  
  // Pincode-based dynamic shipping (Shiprocket Estimates + 40 COD Fee)
  const pincode = address.pincode;
  const prefix3 = pincode.substring(0, 3);
  const prefix2 = pincode.substring(0, 2);
  const firstDigit = pincode.substring(0, 1);
  
  let delivery = 110; // Default (South/East India) - ~70 shipping + 40 COD
  
  if (prefix3 === "135") {
    // Local Yamunanagar
    delivery = 70; // 30 shipping + 40 COD
  } else if (prefix2 === "12" || prefix2 === "13") {
    // Rest of Haryana
    delivery = 75; // 35 shipping + 40 COD
  } else if (["11", "14", "16", "17", "20", "21", "22", "23", "24", "25", "26", "27", "28", "30", "31", "32", "33", "34"].includes(prefix2)) {
    // Delhi, Punjab, Chandigarh, HP, UP, Rajasthan (Regional)
    delivery = 85; // 45 shipping + 40 COD
  } else if (["4", "5", "38", "39"].includes(firstDigit) || ["38", "39"].includes(prefix2)) {
    // MP, Maharashtra, Gujarat, South (Metro/National)
    delivery = 100; // 60 shipping + 40 COD
  } else if (["7", "8", "9"].includes(firstDigit)) {
    // East, North East, J&K
    delivery = 120; // 80 shipping + 40 COD
  }
  
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
