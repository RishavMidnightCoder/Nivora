"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import HeroPanel from "@/components/widgets/Heropanel";
import Logo from "@/components/elements/Logo";
import { teamApi } from "@/services/api";

function CreatePasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This invite link is missing or invalid.");
      return;
    }
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await teamApi.acceptInvite(token, { FullName: fullName, password });
      setSubmitted(true);
    } catch {
      // gateway interceptor already shows a toast with the backend's error detail
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Invalid link
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium text-navy-900">
          This invite link isn&rsquo;t valid.
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          Ask your workspace admin to resend the invite, then try the new link.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Back to login
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto grid h-[52px] w-[52px] place-items-center rounded-full bg-emerald-50 text-emerald-500">
          <Check size={24} strokeWidth={3} />
        </span>
        <h2 className="mt-4 font-display text-3xl font-medium text-navy-900">
          You&rsquo;re all set.
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          Your password was created and your Nivora invitation is now active.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Open Nivora <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Accept invitation
      </p>
      <h2 className="mt-3 font-display text-4xl font-medium text-navy-900">
        Create your password.
      </h2>
      <p className="mt-3 text-sm text-slate-500">
        Finish setting up your account to join the Nivora workspace.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-xs font-bold text-slate-600">
          Full name
          <input
            autoFocus
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jordan Smith"
            className="min-h-[44px] rounded-lg border border-slate-200 px-3 text-sm text-navy-900 outline-none focus:border-indigo-400"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs font-bold text-slate-600">
          Password
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="ms-reveal-none min-h-[44px] w-full rounded-lg border border-slate-200 px-3 pr-10 text-sm text-navy-900 outline-none focus:border-indigo-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 flex cursor-pointer items-center text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-2 text-xs font-bold text-slate-600">
          Confirm password
          <div className="relative flex items-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className="ms-reveal-none min-h-[44px] w-full rounded-lg border border-slate-200 px-3 pr-10 text-sm text-navy-900 outline-none focus:border-indigo-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3 flex cursor-pointer items-center text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        {error && <p className="text-xs font-semibold text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create password"} <Check className="h-4 w-4" />
        </button>

        <p className="text-center text-xs text-slate-400">
          This invitation link is single-use — if it&rsquo;s expired, ask your admin to resend it.
        </p>
      </form>

      <style jsx global>{`
        .ms-reveal-none::-ms-reveal,
        .ms-reveal-none::-ms-clear {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default function CreatePasswordPage() {
  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-2">
      <HeroPanel />

      <div className="flex flex-col items-center justify-center px-6 py-16 sm:px-10">
        <div className="mb-10 w-full max-w-sm lg:hidden">
          <Logo tone="dark" />
        </div>
        <Suspense fallback={null}>
          <CreatePasswordForm />
        </Suspense>
      </div>
    </div>
  );
}