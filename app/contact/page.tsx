import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { storeInfo } from "@/lib/store-info";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <Section muted>
      <Container>
        <SectionTitle
          eyebrow="Contact"
          title="Need help matching an accessory?"
          description="Share your phone model and the accessory you need. The response can stay practical, fast and compatibility-first."
        />
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1fr]">
          <div className="space-y-4">
            <ContactTile icon={Phone} title={storeInfo.phone} text="Call and WhatsApp support" />
            <ContactTile icon={Mail} title={storeInfo.email} text="Product support and bulk orders" />
            <ContactTile icon={MapPin} title={storeInfo.shortAddress} text="Yamunanagar local store and dispatch" />
          </div>
          <form className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Name" />
              <Input placeholder="Phone model" />
            </div>
            <div className="mt-4">
              <Input placeholder="Email address" type="email" />
            </div>
            <textarea className="mt-4 min-h-40 w-full resize-none rounded-3xl border border-slate-200 bg-white p-5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100" placeholder="Tell us what you are looking for" />
            <Button className="mt-4 w-full sm:w-auto">Send message</Button>
          </form>
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
    <div className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
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
