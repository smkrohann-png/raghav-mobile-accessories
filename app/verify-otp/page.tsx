import Link from "next/link";

import { AuthPanel } from "@/components/auth/AuthPanel";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "OTP Verification",
};

export default function VerifyOtpPage() {
  return (
    <Section muted>
      <Container className="max-w-5xl">
        <AuthPanel mode="otp" />
        <p className="mt-5 text-center text-sm font-semibold text-slate-600">
          OTP verified? <Link href="/reset-password" className="text-orange-600">Reset password</Link>
        </p>
      </Container>
    </Section>
  );
}
