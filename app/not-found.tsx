import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section>
      <Container className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-600">404</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">This accessory shelf is empty.</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">The page you opened is not available. Head back to the storefront and keep browsing.</p>
        <Button href="/products" className="mt-8">Back to products</Button>
      </Container>
    </Section>
  );
}
