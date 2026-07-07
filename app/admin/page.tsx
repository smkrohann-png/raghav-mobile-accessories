"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AuthPanel } from "@/components/auth/AuthPanel";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useAuthStore } from "@/store/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, router, user]);

  return (
    <Section muted>
      <Container className="max-w-5xl">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-600 shadow-sm">
            Checking secure session...
          </div>
        ) : (
          <AuthPanel mode="login" />
        )}
      </Container>
    </Section>
  );
}
