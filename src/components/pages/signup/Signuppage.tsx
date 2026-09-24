"use client";

import { useRouter } from "next/navigation";
import HeroPanel from "@/components/widgets/Heropanel";
import SignupForm from "@/components/widgets/signupform";
import Logo from "@/components/elements/Logo";
import { authApi } from "../../../services/api";

export default function SignupPage() {
  const router = useRouter();

  async function handleSignup(payload: {
    FullName: string;
    email: string;
    password: string;
  }) {
    await authApi.signup(payload);
    // Adjust once you confirm the post-signup flow (e.g. OTP verification
    // or straight to login):
    router.push("/login");
  }

  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-2">
      <HeroPanel />

      <div className="flex flex-col items-center justify-center px-6 py-16 sm:px-10">
        <div className="mb-10 w-full max-w-sm lg:hidden">
          <Logo tone="dark" />
        </div>
        <SignupForm onSignup={handleSignup} />
      </div>
    </div>
  );
}