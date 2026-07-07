import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;

  return (
    <Section>
      <Container className="max-w-3xl text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
        <h1 className="mt-6 text-4xl font-black text-slate-950">Order placed</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          {orderId ? `Order ${orderId} is saved. Customer and admin dashboards will now show the same live status updates.` : "Your order is saved and ready for tracking."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/profile">View dashboard</Button>
          <Button href="/orders" variant="secondary">Track order</Button>
        </div>
      </Container>
    </Section>
  );
}
