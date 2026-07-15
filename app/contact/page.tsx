"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { storeInfo } from "@/lib/store-info";

type RequestType = "contact" | "complaint" | "repair";

export default function ContactPage() {
  const [requestType, setRequestType] = useState<RequestType>("contact");
  const [sent, setSent] = useState(false);
  const [modalInfo, setModalInfo] = useState<{show: boolean, type: 'success'|'error', message: string}>({ show: false, type: 'success', message: '' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: requestType,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject") || requestType,
          message: formData.get("message"),
          meta: {
            deviceModel: formData.get("deviceModel"),
            issueType: formData.get("issueType"),
          }
        }),
      });
      if (response.ok) {
        form.reset();
        setSent(true);
        setModalInfo({ show: true, type: 'success', message: "Your request has been submitted successfully! We will get back to you soon." });
      } else {
        setModalInfo({ show: true, type: 'error', message: "Error: Database connection failed. Please ensure MONGODB_URI is set correctly in Vercel." });
      }
    } catch (error) {
      setModalInfo({ show: true, type: 'error', message: "Network Error: Could not connect to the server." });
    }
  }

  return (
    <>
    <Section muted className="pt-24 pb-16 min-h-screen">
      <Container>
        <SectionTitle
          eyebrow="Get In Touch"
          title="How can we help you today?"
          description="Select a category below so we can assist you as fast as possible."
        />
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div className="space-y-4">
            <ContactTile icon={Phone} title={storeInfo.phone} text="Call and WhatsApp support" />
            <ContactTile icon={Mail} title={storeInfo.email} text="Product support and bulk orders" />
            <ContactTile icon={MapPin} title={storeInfo.shortAddress} text="Yamunanagar local store and dispatch" />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              {[
                { id: "contact", label: "Contact Us" },
                { id: "complaint", label: "Complaint" },
                { id: "repair", label: "Book Repair" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRequestType(tab.id as RequestType)}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${
                    requestType === tab.id
                      ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="name" placeholder="Full Name" required />
                <Input name="phone" placeholder="Phone Number" type="tel" required />
              </div>
              
              <div className="mt-4">
                <Input name="email" placeholder="Email Address (Optional)" type="email" />
              </div>

              {requestType === "contact" && (
                <div className="mt-4">
                  <Input name="subject" placeholder="What is this regarding?" required />
                </div>
              )}

              {requestType === "complaint" && (
                <div className="mt-4">
                  <Input name="subject" placeholder="Order ID or Product Name" required />
                </div>
              )}

              {requestType === "repair" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <select 
                    name="deviceModel" 
                    className="flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>Select Device Brand & Model</option>
                    <optgroup label="Apple iPhone">
                      <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                      <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                      <option value="iPhone 15 Plus">iPhone 15 Plus</option>
                      <option value="iPhone 15">iPhone 15</option>
                      <option value="iPhone 14 Pro Max">iPhone 14 Pro Max</option>
                      <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                      <option value="iPhone 14 Plus">iPhone 14 Plus</option>
                      <option value="iPhone 14">iPhone 14</option>
                      <option value="iPhone 13 Pro Max">iPhone 13 Pro Max</option>
                      <option value="iPhone 13 Pro">iPhone 13 Pro</option>
                      <option value="iPhone 13">iPhone 13</option>
                      <option value="iPhone 12 / 12 Pro">iPhone 12 / 12 Pro</option>
                      <option value="iPhone 11 / 11 Pro">iPhone 11 / 11 Pro</option>
                      <option value="Older iPhone Models">Older iPhone Models</option>
                    </optgroup>
                    <optgroup label="Samsung">
                      <option value="Galaxy S24 Series">Galaxy S24 Series</option>
                      <option value="Galaxy S23 Series">Galaxy S23 Series</option>
                      <option value="Galaxy S22 Series">Galaxy S22 Series</option>
                      <option value="Galaxy Z Fold / Flip">Galaxy Z Fold / Flip</option>
                      <option value="Galaxy A Series">Galaxy A Series (A54, A34, etc.)</option>
                      <option value="Galaxy M / F Series">Galaxy M / F Series</option>
                    </optgroup>
                    <optgroup label="OnePlus">
                      <option value="OnePlus 12 / 12R">OnePlus 12 / 12R</option>
                      <option value="OnePlus 11 / 11R">OnePlus 11 / 11R</option>
                      <option value="OnePlus 10 Series">OnePlus 10 Series</option>
                      <option value="OnePlus 9 Series">OnePlus 9 Series</option>
                      <option value="OnePlus Nord Series">OnePlus Nord Series</option>
                    </optgroup>
                    <optgroup label="Xiaomi / Redmi / POCO">
                      <option value="Xiaomi 14 Series">Xiaomi 14 Series</option>
                      <option value="Xiaomi 13 Series">Xiaomi 13 Series</option>
                      <option value="Redmi Note 13 Series">Redmi Note 13 Series</option>
                      <option value="Redmi Note 12 Series">Redmi Note 12 Series</option>
                      <option value="POCO X / F / M Series">POCO X / F / M Series</option>
                    </optgroup>
                    <optgroup label="Other Brands">
                      <option value="Vivo (V Series, X Series)">Vivo (V Series, X Series)</option>
                      <option value="Oppo (Reno, Find, A Series)">Oppo (Reno, Find, A Series)</option>
                      <option value="Realme (Number, Pro, C Series)">Realme (Number, Pro, C Series)</option>
                      <option value="Nothing Phone">Nothing Phone (1 / 2 / 2a)</option>
                      <option value="Motorola (Edge, G Series)">Motorola (Edge, G Series)</option>
                      <option value="iQOO Series">iQOO Series</option>
                      <option value="Google Pixel">Google Pixel</option>
                      <option value="Other Model (Mention in issue)">Other Model (Mention in details below)</option>
                    </optgroup>
                  </select>
                  <Input name="issueType" placeholder="Issue (e.g., Screen broken)" required />
                </div>
              )}

              <textarea 
                name="message" 
                className="mt-4 min-h-[140px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100" 
                placeholder={
                  requestType === "repair" ? "Describe the issue in detail..." :
                  requestType === "complaint" ? "Please explain your complaint..." :
                  "Tell us what you need help with..."
                } 
                required 
              />
              
              <div className="mt-6 flex items-center gap-4">
                <Button className="w-full sm:w-auto px-8">Submit Request</Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Section>

    {/* Custom Modal */}
    {modalInfo.show && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-200">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${modalInfo.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'} mb-6`}>
            {modalInfo.type === 'success' ? (
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">{modalInfo.type === 'success' ? 'Success!' : 'Error'}</h3>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            {modalInfo.message}
          </p>
          <Button className="w-full" onClick={() => setModalInfo({ ...modalInfo, show: false })}>
            Got it, thanks!
          </Button>
        </div>
      </div>
    )}
    </>
  );
}

function ContactTile({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Phone;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-bold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}
