import Link from "next/link";
import { Sparkles, UserPlus } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-[34px] py-7">
      <div className="inline-flex items-center gap-2 text-lg font-bold tracking-[-0.04em] text-[#172238]">
        <Sparkles size={18} className="text-[#91aaff]" />
        Nivora
      </div>

      <div className="flex items-center gap-[22px]">
        <Link href="/login" className="text-xs font-extrabold text-[#536174]">
          Log in
        </Link>
        <Link
          href="/signup"
          className="inline-flex min-h-[38px] items-center justify-center gap-2.5 rounded-[7px] bg-[#284bce] px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c]"
        >
          Start for free <UserPlus size={15} />
        </Link>
      </div>
    </nav>
  );
}