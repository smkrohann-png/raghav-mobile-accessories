import Link from "next/link";

import { AuthPanel } from "@/components/auth/AuthPanel";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <Section muted>
      <Container className="max-w-5xl">
        <AuthPanel mode="login" />
        <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm font-semibold text-slate-600">
          <Link href="/register" className="hover:text-emerald-600">Create account</Link>
          <Link href="/forgot-password" className="hover:text-emerald-600">Forgot password?</Link>
        </div>
      </Container>
    </Section>
  );
}
