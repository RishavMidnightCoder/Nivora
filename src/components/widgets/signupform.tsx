"use client";

import { useState, FormEvent } from "react";
import { UserPlus } from "lucide-react";
import Input from "@/components/elements/Input";
import Button from "@/components/elements/Button";

interface SignupPayload {
  FullName: string;
  email: string;
  password: string;
}

interface SignupFormProps {
  onSignup?: (payload: SignupPayload) => Promise<void> | void;
}

export default function SignupForm({ onSignup }: SignupFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    setLoading(true);
    try {
      await onSignup?.({ FullName: fullName, email, password });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Welcome back
      </p>
      <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-navy-900">
        Create your workspace
      </h2>
      <p className="mt-3 text-sm text-slate-500">
        Start organizing your team&apos;s best work.
      </p>

      <div className="my-8 flex items-center gap-4">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">create your account</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          id="fullName"
          label="Full name"
          type="text"
          placeholder="Alex Morgan"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />

        <Input
          id="email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <Button
          type="submit"
          loading={loading}
          icon={<UserPlus className="h-4 w-4" />}
        >
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Sign in
        </a>
      </p>

      <p className="mt-10 text-center text-xs leading-relaxed text-slate-400">
        By continuing, you agree to our{" "}
        <a href="/terms" className="text-slate-500 underline hover:text-slate-700">
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