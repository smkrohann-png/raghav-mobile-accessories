import { SITE_CONFIG } from "@/constants/site";

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout({
  amount,
  email,
  phone,
  userName,
  onSuccess,
  onFailure,
}: {
  amount: number;
  email: string;
  phone: string;
  userName: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onFailure("Failed to load Razorpay SDK. Please check your internet connection.");
    return;
  }

  // Create simulated order on the server
  let orderId = `order_rzp_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const response = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    
    if (response.ok) {
      const data = await response.json();
      orderId = data.orderId;
    }
  } catch (err) {
    console.warn("Could not create Razorpay order ID on backend, falling back to simulated checkout", err);
  }

  const options: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mockKey12345",
    amount: amount * 100, // amount in paisa
    currency: "INR",
    name: SITE_CONFIG.name,
    description: "Purchase Mobile Accessories",
    order_id: orderId,
    prefill: {
      name: userName,
      email: email,
      contact: phone,
    },
    theme: {
      color: "#ff6b00", // Brand Orange
    },
    handler: function (response: any) {
      // payment succeeded
      onSuccess(response.razorpay_payment_id || `pay_${Math.random().toString(36).substr(2, 9)}`);
    },
  };

  const rzp = new (window as any).Razorpay(options);
  
  rzp.on("payment.failed", function (resp: any) {
    onFailure(resp.error.description || "Payment failed");
  });

  rzp.open();
}
