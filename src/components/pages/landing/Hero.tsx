import Link from "next/link";
import DashboardPreview from "@/components/pages/landing/DashboardPreview";

export default function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-[1180px] items-center gap-[42px] px-[34px] pb-[92px] pt-[66px] lg:grid-cols-[0.85fr_1.15fr]">
      <div className="relative z-[1]">
        <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#76859a]">
          The workspace for momentum
        </p>

        <h1 className="m-0 font-display font-medium leading-[0.93] tracking-[-0.07em] text-[#172238] text-[clamp(62px,8vw,102px)]">
          Make progress
          <br />
          <em className="italic not-italic text-[#284bce]">visible.</em>
        </h1>

        <p className="mb-[29px] mt-7 max-w-[470px] text-base leading-[1.7] text-[#687589]">
          Nivora brings tasks, projects, and people into one calm workspace so
          your team can focus on the work that moves everything forward.
        </p>

        <div className="flex items-center gap-[22px]">
          <Link
            href="/signup"
            className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-[7px] bg-[#284bce] px-[19px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c]"
          >
            Build your workspace
            <span className="ml-2 text-lg">→</span>
          </Link>
          <a
            href="#landing-features"
            className="inline-flex items-center py-2.5 text-xs font-extrabold text-[#536174]"
          >
            See how it works
            <span className="ml-[7px] text-[#284bce]">↓</span>
          </a>
        </div>

        <p className="mt-4 text-[10px] text-[#9ba4b0]">
          No credit card required · Set up in minutes
        </p>
      </div>

      <DashboardPreview />
    </section>
  );
}