"use client";

import { useState, useEffect, FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import Input from "@/components/elements/Input";
import Button from "@/components/elements/Button";

type Step = "email" | "otp";

const RESEND_COOLDOWN_SECONDS = 30;

interface FormProps {
  onSubmitEmail?: (email: string) => Promise<void> | void;
  onVerifyOtp?: (email: string, otp: string) => Promise<void> | void;
  onResendOtp?: (email: string) => Promise<void> | void;
}

export default function Form({
  onSubmitEmail,
  onVerifyOtp,
  onResendOtp,
}: FormProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (step === "email") {
      if (!email) return;
      setLoading(true);
      try {
        await onSubmitEmail?.(email);
        setStep("otp");
        setCooldown(RESEND_COOLDOWN_SECONDS);
      } finally {
        setLoading(false);
      }
      return;
    }

    // step === "otp"
    if (!otp) return;
    setLoading(true);
    try {
      await onVerifyOtp?.(email, otp);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await onResendOtp?.(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Welcome back
      </p>
      <h2 className="mt-3 font-display text-4xl font-medium text-navy-900">
        Good to see you.
      </h2>
      <p className="mt-3 text-sm text-slate-500">
        Sign in to pick up where you left off.
      </p>

      <div className="my-8 flex items-center gap-4">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">sign in with email</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          id="email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          readOnly={step === "otp"}
          className={
            step === "otp"
              ? "border-indigo-200 bg-indigo-50 text-navy-900 cursor-not-allowed"
              : ""
          }
        />

        {step === "otp" && (
          <Input
            id="otp"
            label="One-time code"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            required
            autoFocus
          />
        )}

        <div>
          <Button
            type="submit"
            loading={loading}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            {step === "email" ? "Send one-time code" : "Verify and sign in"}
          </Button>

          {step === "otp" && (
            <p className="mt-3 text-xs text-slate-500">
              A 6-digit code was sent to {email}.{" "}
              {cooldown > 0 ? (
                <span className="text-slate-400">Resend in {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {resending ? "Sending…" : "Resend code"}
                </button>
              )}
            </p>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New to Nivora?{" "}
        <a
          href="/signup"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Create an account
        </a>
      </p>

      <p className="mt-10 text-center text-xs leading-relaxed text-slate-400">
        By continuing, you agree to our{" "}
        <a
          href="/terms"
          className="text-slate-500 underline hover:text-slate-700"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="text-slate-500 underline hover:text-slate-700"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
