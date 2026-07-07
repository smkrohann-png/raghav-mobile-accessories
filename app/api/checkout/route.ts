import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/payments";
import { products } from "@/data/storefront";
import type { CustomerOrder, PaymentMethod } from "@/types/commerce";

// CHECKOUT - Create order from cart
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
    const { addressId, paymentMethod } = body;

    if (!addressId || !paymentMethod) {
      return NextResponse.json(
        { error: "Address and payment method required" },
        { status: 400 }
      );
    }

    // Get user
    const user = db.getUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get address
    const address = db.getAddressById(addressId);
    if (!address || address.userId !== session.userId) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get cart
    const cart = db.getCartByUserId(session.userId);
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!["Cash On Delivery", "Razorpay"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Map cart items to full product details
    const orderProducts: typeof products = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = products.find((p) => p.id === cartItem.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${cartItem.productId}` },
          { status: 404 }
        );
      }

      // Add product with quantity info (we'll store it as requested)
      orderProducts.push(product);
      totalAmount += product.price * cartItem.quantity;
    }

    // Create order
    const order: CustomerOrder = {
      id: "",
      customer: session.userId,
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      phone: address.phone,
      address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
      date: new Date().toISOString(),
      amount: totalAmount,
      status: "Pending",
      paymentMethod: paymentMethod as PaymentMethod,
      paymentStatus: "Pending Payment",
      products: orderProducts,
      messages: [
        {
          status: "Pending",
          text:
            paymentMethod === "Razorpay"
              ? "Order created. Waiting for online payment confirmation."
              : "Order placed successfully. Waiting for admin confirmation.",
          time: new Date().toISOString(),
        },
      ],
    };

    const createdOrder = db.createOrder(order);

    if (paymentMethod === "Razorpay") {
      if (!isRazorpayConfigured()) {
        db.updateOrder(createdOrder.id, {
          paymentStatus: "Payment Failed",
          paymentFailureReason: "Razorpay keys are not configured",
          messages: [
            ...createdOrder.messages,
            {
              status: "Pending",
              text: "Online payment could not start because Razorpay keys are not configured.",
              time: new Date().toISOString(),
            },
          ],
        });

        return NextResponse.json(
          { error: "Razorpay is not configured on the server" },
          { status: 503 }
        );
      }

      const razorpayOrder = await createRazorpayOrder({
        amount: totalAmount,
        receipt: createdOrder.id,
        notes: {
          localOrderId: createdOrder.id,
          customerId: session.userId,
        },
      });

      const updatedOrder = db.updateOrder(createdOrder.id, {
        razorpayOrderId: razorpayOrder.id,
      }) || createdOrder;

      return NextResponse.json(
        {
          message: "Razorpay order created",
          order: {
            id: updatedOrder.id,
            status: updatedOrder.status,
            amount: updatedOrder.amount,
            paymentMethod: updatedOrder.paymentMethod,
            paymentStatus: updatedOrder.paymentStatus,
            razorpayOrderId: razorpayOrder.id,
            razorpayKeyId: getRazorpayKeyId(),
            customer: {
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              phone: address.phone,
            },
          },
        },
        { status: 201 }
      );
    }

    // Clear cart
    cart.items = [];
    db.updateCart(cart.id, cart);

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: {
          id: createdOrder.id,
          status: createdOrder.status,
          amount: createdOrder.amount,
          paymentMethod: createdOrder.paymentMethod,
          paymentStatus: createdOrder.paymentStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
