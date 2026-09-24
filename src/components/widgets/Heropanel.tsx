import Logo from "@/components/elements/Logo";
import SprintCard from "@/components/widgets/Sprintcard";

export default function HeroPanel() {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-navy-950 px-12 py-12 lg:flex xl:px-16">
      <div>
        <Logo tone="light" />
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-indigo-300/80">
          Work, in sync
        </p>
      </div>

      <div className="max-w-md">
        <h1 className="font-display text-5xl font-medium leading-[1.05] text-white xl:text-6xl">
          Move the work
          <br />
          <span className="italic text-lavender-300">forward.</span>
        </h1>
        <p className="mt-6 max-w-sm text-base leading-relaxed text-slate-300">
          The calm, focused workspace for ambitious teams building what
          matters next.
        </p>

        <div className="mt-10">
          <SprintCard />
        </div>
      </div>

      <p className="text-sm text-slate-400">
        Trusted by teams who ship with intention.
      </p>
    </div>
  );
}