import Link from "next/link";

import { AuthPanel } from "@/components/auth/AuthPanel";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <Section muted>
      <Container className="max-w-5xl">
        <AuthPanel mode="reset" />
        <p className="mt-5 text-center text-sm font-semibold text-slate-600">
          Password changed? <Link href="/login" className="text-emerald-600">Login</Link>
        </p>
      </Container>
    </Section>
  );
}
