import { SITE_CONFIG } from "@/constants/site";

export default function PrivacyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-black text-slate-900 mb-3">Privacy Policy</h1>
      <div className="h-1 w-12 rounded-full bg-orange-500 mb-6" />
      <p className="text-xs font-semibold text-slate-400 mb-10 uppercase tracking-wider">
        Effective Date: January 1, 2026 · Last Updated: June 28, 2026
      </p>

      <div className="prose prose-slate max-w-none space-y-8">
        {[
          {
            title: "1. Information We Collect",
            content:
              "We collect personal information that you voluntarily provide when you register, place an order, or contact us. This includes your full name, email address, phone number, shipping address, and payment information. We do not store your credit card details — all payments are processed securely by Razorpay.",
          },
          {
            title: "2. How We Use Your Information",
            content:
              "We use collected information to process and fulfill your orders, send order confirmations and shipping updates, provide customer support, improve our website and product offerings, send promotional emails (only with your consent), and prevent fraud and ensure security.",
          },
          {
            title: "3. Sharing Your Information",
            content:
              "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers such as Razorpay (payments), Shiprocket (shipping and logistics), and email service providers, only as necessary to operate our business.",
          },
          {
            title: "4. Data Security",
            content:
              "We implement industry-standard security measures to protect your personal information. All payment data is encrypted using SSL technology. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
          },
          {
            title: "5. Cookies",
            content:
              "Our website uses cookies to enhance your browsing experience, remember your cart items and wishlist, and analyze website traffic. You may disable cookies in your browser settings, but this may affect website functionality.",
          },
          {
            title: "6. Your Rights",
            content:
              "You have the right to access, correct, or delete your personal information at any time. You can manage your information through your account profile, or contact us at " +
              SITE_CONFIG.email +
              " to request data deletion.",
          },
          {
            title: "7. Contact Us",
            content: `If you have questions about this Privacy Policy, please contact us at ${SITE_CONFIG.email} or call us at ${SITE_CONFIG.phone}. We will respond within 5 business days.`,
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
