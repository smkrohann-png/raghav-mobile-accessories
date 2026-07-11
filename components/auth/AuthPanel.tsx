"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type AuthMode = "login" | "register" | "forgot" | "otp" | "reset";

const copy = {
  login: {
    title: "Welcome back",
    text: "Sign in to review orders, saved address and delivery updates.",
    button: "Login",
  },
  register: {
    title: "Create account",
    text: "Register first, then use the same username/email and password to open your profile.",
    button: "Register",
  },
  forgot: {
    title: "Recover password",
    text: "Enter your email to receive a frontend OTP verification step.",
    button: "Send OTP",
  },
  otp: {
    title: "Verify OTP",
    text: "Enter the 6-digit code sent to your registered contact.",
    button: "Verify",
  },
  reset: {
    title: "Reset password",
    text: "Choose a new password and return to login.",
    button: "Reset password",
  },
};

export function AuthPanel({ mode }: { mode: AuthMode }) {
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState("");
  const [loginRole, setLoginRole] = useState<"customer" | "admin">("customer");
  const router = useRouter();
  const { login, register, forgotPassword, verifyOTP, resetPassword, isLoading, error, clearError } = useAuthStore();

  async function handleSubmit(formData: FormData) {
    setSubmitted(false);
    setLocalError("");
    clearError();

    try {
      if (mode === "login") {
        await login(String(formData.get("identifier")), String(formData.get("password")));
        setSubmitted(true);
        const user = useAuthStore.getState().user;
        if (loginRole === "admin" && user?.role !== "admin") {
          setLocalError("This account does not have admin access.");
          return;
        }
        router.push(user?.role === "admin" ? "/admin/dashboard" : "/profile");
        return;
      }

      if (mode === "register") {
        const fullName = String(formData.get("fullName") || "").trim();
        const [firstName = "", ...rest] = fullName.split(/\s+/);
        const password = String(formData.get("password"));
        const confirmPassword = String(formData.get("confirmPassword"));
        if (password !== confirmPassword) {
          setLocalError("Password and confirm password do not match.");
          return;
        }
        await register({
          firstName,
          lastName: rest.join(" ") || "Customer",
          username: String(formData.get("email")).split("@")[0],
          email: String(formData.get("email")),
          password,
          phone: String(formData.get("phone")),
        });
        setSubmitted(true);
        router.push("/profile");
        return;
      }

      if (mode === "forgot") {
        const email = String(formData.get("email"));
        await forgotPassword(email);
        sessionStorage.setItem("reset_email", email);
        setSubmitted(true);
        setTimeout(() => router.push("/verify-otp"), 1500);
        return;
      }

      if (mode === "otp") {
        const email = sessionStorage.getItem("reset_email");
        if (!email) throw new Error("Session expired. Please try again.");
        const otp = String(formData.get("otp"));
        const token = await verifyOTP(email, otp);
        sessionStorage.setItem("reset_token", token);
        setSubmitted(true);
        setTimeout(() => router.push("/reset-password"), 1500);
        return;
      }

      if (mode === "reset") {
        const token = sessionStorage.getItem("reset_token");
        if (!token) throw new Error("Session expired. Please try again.");
        const password = String(formData.get("password"));
        const confirm = String(formData.get("confirmPassword"));
        if (password !== confirm) throw new Error("Passwords do not match");
        await resetPassword(token, password);
        setSubmitted(true);
        sessionStorage.removeItem("reset_email");
        sessionStorage.removeItem("reset_token");
        setTimeout(() => router.push("/login"), 1500);
        return;
      }

      setSubmitted(true);
    } catch (caught) {
      setLocalError(caught instanceof Error ? caught.message : "Authentication failed");
    }
  }

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:grid-cols-[0.72fr_1fr]">
      <aside className="rounded-2xl bg-slate-950 p-6 text-white">
        <ShieldCheck className="h-9 w-9 text-orange-300" aria-hidden />
        <h1 className="mt-6 text-3xl font-black">{copy[mode].title}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">{copy[mode].text}</p>
      </aside>
      <form
        className="self-center"
        action={handleSubmit}
      >
        {mode === "login" ? (
          <div className="mb-5 grid grid-cols-2 rounded-full bg-slate-100 p-1">
            {[
              { label: "Customer Login", value: "customer" as const, icon: UserRound },
              { label: "Admin Login", value: "admin" as const, icon: LockKeyhole },
            ].map(({ label, value, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => setLoginRole(value)}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold transition ${
                  loginRole === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        ) : null}
        {mode === "register" ? (
          <div className="mb-4">
            <Input name="fullName" placeholder="Full name" required autoComplete="name" />
          </div>
        ) : null}
        {mode === "login" ? <Input className="mb-4" name="identifier" placeholder="Username or email" required autoComplete="username" /> : null}
        {mode === "register" || mode === "forgot" ? <Input className="mb-4" name="email" placeholder="Email address" required type="email" autoComplete="email" /> : null}
        {mode === "register" ? <Input className="mb-4" name="phone" placeholder="Phone number" required inputMode="numeric" /> : null}
        {mode === "login" || mode === "register" ? <Input className="mb-4" name="password" placeholder="Password" required type="password" /> : null}
        {mode === "register" ? <Input className="mb-4" name="confirmPassword" placeholder="Confirm password" required type="password" /> : null}
        {mode === "otp" ? <Input className="mb-4 text-center tracking-[0.45em]" name="otp" maxLength={6} placeholder="000000" required /> : null}
        {mode === "reset" ? (
          <div className="grid gap-4">
            <Input name="password" placeholder="New password" required type="password" />
            <Input name="confirmPassword" placeholder="Confirm password" required type="password" />
          </div>
        ) : null}
        <Button className="mt-5 w-full" disabled={isLoading} size="lg" type="submit">
          {isLoading ? "Please wait..." : copy[mode].button}
          <ArrowRight className="h-4 w-4" />
        </Button>
        {error || localError ? (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error || localError}
          </p>
        ) : null}
        {submitted ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {mode === "login" ? "Login successful. Opening your profile..." : mode === "register" ? "Account created. Opening your profile..." : "Flow completed."}
          </p>
        ) : null}
      </form>
    </div>
  );
}
