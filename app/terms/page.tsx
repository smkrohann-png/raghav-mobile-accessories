import { SITE_CONFIG } from "@/constants/site";

export default function TermsPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-black text-slate-900 mb-3">Terms & Conditions</h1>
      <div className="h-1 w-12 rounded-full bg-orange-500 mb-6" />
      <p className="text-xs font-semibold text-slate-400 mb-10 uppercase tracking-wider">
        Effective Date: January 1, 2026 · Last Updated: June 28, 2026
      </p>

      <div className="space-y-6">
        {[
          {
            title: "1. Acceptance of Terms",
            content:
              "By accessing and using raghavmobile.com, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.",
          },
          {
            title: "2. Product Descriptions & Pricing",
            content:
              "We make every effort to display product descriptions, images, and prices accurately. However, we do not warrant that product descriptions or other content on this site is accurate, complete, reliable, or error-free. We reserve the right to modify prices without prior notice.",
          },
          {
            title: "3. Order Placement & Acceptance",
            content:
              "By placing an order, you are making an offer to purchase the product. We reserve the right to accept or decline any order at our discretion. An order is considered confirmed only when you receive an order confirmation email from us.",
          },
          {
            title: "4. Payment Terms",
            content:
              "We accept online payments via Razorpay (UPI, Credit/Debit Cards, Netbanking) and Cash on Delivery (COD) for eligible orders. All prices are in Indian Rupees (INR) and inclusive of applicable taxes. COD orders may incur an additional handling fee of ₹30.",
          },
          {
            title: "5. Shipping & Delivery",
            content:
              "We ship pan-India via Shiprocket. Standard delivery takes 3–7 business days. Express delivery is available for select pin codes. Free shipping is available on orders above ₹499. We are not responsible for delays caused by courier partners or natural events.",
          },
          {
            title: "6. Return & Refund Policy",
            content:
              "We offer a 7-day return policy for defective or incorrect products. Products must be returned in original packaging with all accessories. Refunds are processed within 5–7 business days after we receive and verify the returned item.",
          },
          {
            title: "7. Intellectual Property",
            content:
              "All content on this website, including logos, images, text, and product descriptions, is the intellectual property of Raghav Mobile Accessories. Unauthorized use, reproduction, or distribution is strictly prohibited.",
          },
          {
            title: "8. Limitation of Liability",
            content:
              "Raghav Mobile Accessories shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services. Our maximum liability is limited to the purchase price of the product in question.",
          },
          {
            title: "9. Governing Law",
            content:
              "These Terms and Conditions are governed by the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of courts in Ambala, Haryana.",
          },
          {
            title: "10. Contact",
            content: `For questions about these Terms, contact us at ${SITE_CONFIG.email} or ${SITE_CONFIG.phone}.`,
          },
        ].map((section, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-3">{section.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
