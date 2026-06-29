"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ShieldAlert, KeyRound, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // View states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showForgotPwd, setShowForgotPwd] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpVal, setOtpVal] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const { login, register, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");
    setIsLoading(true);

    if (isRegisterMode) {
      if (!name || !email) {
        setFeedback("Please fill all required registration fields.");
        setIsLoading(false);
        return;
      }
      try {
        await register(name, email);
        router.push("/profile");
      } catch (err) {
        setFeedback("Registration failed. Please try again.");
      }
    } else {
      if (!email) {
        setFeedback("Please enter your email address.");
        setIsLoading(false);
        return;
      }
      try {
        await login(email, name);
        router.push("/profile");
      } catch (err) {
        setFeedback("Login failed. Please verify credentials.");
      }
    }
    setIsLoading(false);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setFeedback("Please enter email to send OTP.");
      return;
    }
    setFeedback("OTP has been sent to your email!");
    setShowOtpScreen(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpVal === "1234") {
      setIsLoading(true);
      await login(email, "OTP Customer");
      setIsLoading(false);
      router.push("/profile");
    } else {
      setFeedback("Invalid OTP entered. Try '1234' for testing.");
    }
  };

  return (
    <div className="container py-12 flex justify-center items-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl relative overflow-hidden"
      >
        {/* Blurs */}
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-orange-100/50 blur-2xl" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-orange-100/50 blur-2xl" />

        {/* Heading */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white mb-4">
            <KeyRound size={22} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {showForgotPwd
              ? "Reset Password"
              : showOtpScreen
              ? "Enter OTP"
              : isRegisterMode
              ? "Create Account"
              : "Welcome Back"}
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">
            {showForgotPwd
              ? "We'll send recovery links"
              : showOtpScreen
              ? "Verification code sent"
              : isRegisterMode
              ? "Get original premium accessories"
              : "Premium Mobile Accessories"}
          </p>
        </div>

        {feedback && (
          <div className="mb-5 flex items-start gap-2 rounded-2xl bg-orange-50 border border-orange-100 p-3.5 text-xs text-orange-700 font-bold">
            <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* OTP Screen */}
          {showOtpScreen ? (
            <motion.form
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-5 relative z-10"
            >
              <Input
                label="Enter 4-Digit OTP"
                value={otpVal}
                onChange={(e) => setOtpVal(e.target.value)}
                placeholder="Try '1234' for demo"
                maxLength={4}
                required
              />
              <Button type="submit" className="w-full rounded-2xl h-11" isLoading={isLoading}>
                Verify & Login
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowOtpScreen(false);
                  setOtpVal("");
                  setFeedback("");
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 mt-2 block text-center mx-auto"
              >
                Go Back to Login
              </button>
            </motion.form>
          ) : showForgotPwd ? (
            /* Forgot Password Screen */
            <motion.form
              key="forgot-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={(e) => {
                e.preventDefault();
                setFeedback("If this email exists, a password reset link has been dispatched.");
              }}
              className="space-y-5 relative z-10"
            >
              <Input
                label="Registered Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                type="email"
                leftIcon={<Mail size={16} />}
                required
              />
              <Button type="submit" className="w-full rounded-2xl h-11">
                Send Recovery Link
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPwd(false);
                  setFeedback("");
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 mt-2 block text-center mx-auto"
              >
                Go Back to Login
              </button>
            </motion.form>
          ) : (
            /* Normal Login/Register Screen */
            <motion.form
              key="auth-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-5 relative z-10"
            >
              {isRegisterMode && (
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  leftIcon={<User size={16} />}
                  required
                />
              )}

              <Input
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                type="email"
                leftIcon={<Mail size={16} />}
                required
              />

              {!isRegisterMode && (
                <div className="relative">
                  <Input
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    type="password"
                    leftIcon={<Lock size={16} />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotPwd(true)}
                    className="absolute right-0 top-0 text-[10px] font-bold text-orange-500 hover:text-orange-600"
                  >
                    Forgot?
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full rounded-2xl h-11 font-bold" isLoading={isLoading}>
                {isRegisterMode ? "Register Account" : "Sign In"}
              </Button>

              {/* Demo Mode / OTP Mode */}
              {!isRegisterMode && (
                <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs font-bold text-slate-500 hover:text-orange-500 transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={13} className="text-orange-400" />
                    Sign In with Email OTP
                  </button>
                </div>
              )}

              {/* Toggle Login/Register */}
              <p className="text-xs font-semibold text-slate-500 text-center mt-6">
                {isRegisterMode ? "Already have an account?" : "New to Raghav Accessories?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setFeedback("");
                  }}
                  className="text-orange-500 font-extrabold hover:text-orange-600"
                >
                  {isRegisterMode ? "Login Here" : "Register Here"}
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
