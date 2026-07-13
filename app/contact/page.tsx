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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
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
        event.currentTarget.reset();
        setSent(true);
        alert("Your request has been submitted successfully!");
        setTimeout(() => setSent(false), 5000);
      } else {
        alert("Error: Database connection failed. Please ensure MONGODB_URI is set correctly in Vercel.");
      }
    } catch (error) {
      alert("Network Error: Could not connect to the server.");
    }
  }

  return (
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
                  <Input name="deviceModel" placeholder="Device Model (e.g., iPhone 13)" required />
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
                {sent && <p className="text-sm font-bold text-emerald-600">Your request has been submitted successfully!</p>}
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Section>
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
