"use client";

import { useRouter } from "next/navigation";
import HeroPanel from "@/components/widgets/Heropanel";
import Form from "@/components/widgets/Form";
import Logo from "@/components/elements/Logo";
import { authApi } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  async function handleSendCode(email: string) {
    await authApi.login({ email });
  }

  async function handleVerifyOtp(email: string, otp: string) {
    await authApi.verifyOtp({ email, otp });
    router.push("/dashboard");
  }

  async function handleResendOtp(email: string) {
    await authApi.resendOtp({ email });
  }

  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-2">
      <HeroPanel />

      <div className="flex flex-col items-center justify-center px-6 py-16 sm:px-10">
        <div className="mb-10 w-full max-w-sm lg:hidden">
          <Logo tone="dark" />
        </div>
        <Form
          onSubmitEmail={handleSendCode}
          onVerifyOtp={handleVerifyOtp}
          onResendOtp={handleResendOtp}
        />
      </div>
    </div>
  );
}