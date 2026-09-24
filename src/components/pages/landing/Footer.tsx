import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1180px] items-center gap-5 border-t border-[#e5e8ed] px-[34px] pb-7 pt-[23px] text-[11px] text-[#9ba4b0]">
      <div className="inline-flex items-center gap-2 text-lg font-bold tracking-[-0.04em] text-[#172238]">
        <Sparkles size={16} className="text-[#91aaff]" />
        Nivora
      </div>
      <span>Work, in sync.</span>
      <Link href="/signup" className="ml-auto text-[11px] font-extrabold text-[#284bce]">
        Get started →
      </Link>
    </footer>
  );
}