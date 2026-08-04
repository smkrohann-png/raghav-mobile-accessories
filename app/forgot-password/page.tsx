import Link from "next/link";

import { AuthPanel } from "@/components/auth/AuthPanel";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <Section muted>
      <Container className="max-w-5xl">
        <AuthPanel mode="forgot" />
        <p className="mt-5 text-center text-sm font-semibold text-slate-600">
          Have the code? <Link href="/verify-otp" className="text-emerald-600">Verify OTP</Link>
        </p>
      </Container>
    </Section>
  );
}
