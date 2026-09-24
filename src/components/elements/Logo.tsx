import { Sparkles } from "lucide-react";

interface LogoProps {
  tone?: "light" | "dark";
}

export default function Logo({ tone = "light" }: LogoProps) {
  const textColor = tone === "light" ? "text-white" : "text-navy-900";

  return (
    <div className="flex items-center gap-2">
      <Sparkles className="h-5 w-5 text-indigo-400" strokeWidth={2.2} />
      <span className={`font-display text-lg font-semibold ${textColor}`}>
        Nivora
      </span>
    </div>
  );
}