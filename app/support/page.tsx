import { Mail, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { storeInfo } from "@/lib/store-info";

export const metadata = {
  title: "Support",
};

export default function SupportPage() {
  return (
    <Section muted className="py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle className="max-w-3xl" eyebrow="Support" title="Need help before or after ordering?" description="Compatibility, delivery, COD and order support ek hi clear page par." />
        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-4 order-2 lg:order-1">
            <SupportTile icon={Phone} title={storeInfo.phone} text="Call and WhatsApp support" />
            <SupportTile icon={MessageCircle} title="WhatsApp support" text="Phone model bhej kar product confirm kar sakte hain" />
            <SupportTile icon={Mail} title={storeInfo.email} text="Order and COD help" />
          </div>
          <form className="order-1 lg:order-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Name" />
              <Input placeholder="Order ID / Phone model" />
            </div>
            <Input className="mt-4" placeholder="Email address" type="email" />
            <textarea className="mt-4 min-h-[140px] sm:min-h-[180px] w-full resize-none rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100" placeholder="How can we help?" />
            <Button className="mt-5 h-12 w-full sm:w-auto px-8">Send request</Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}

function SupportTile({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Phone;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md">
      <span className="grid h-11 w-11 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-bold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}
