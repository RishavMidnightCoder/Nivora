import { Sparkles, Check } from "lucide-react";

export default function DashboardPreview() {
  return (
    <div className="relative flex min-h-[420px] items-center justify-center">
      <div className="absolute h-[390px] w-[390px] rounded-full bg-[#dce4ff] opacity-70 blur-[16px]" />

      <div className="relative z-[1] w-full max-w-[590px] rotate-[1.5deg] overflow-hidden rounded-[13px] border border-[#e1e6ef] bg-white shadow-[0_28px_70px_#263b7022]">
        <div className="flex h-[42px] items-center gap-[14px] border-b border-[#edf0f4] px-[14px] text-[9px] text-[#a0a9b5]">
          <span className="flex gap-1">
            <i className="h-1.5 w-1.5 rounded-full bg-[#dfe4eb]" />
            <i className="h-1.5 w-1.5 rounded-full bg-[#dfe4eb]" />
            <i className="h-1.5 w-1.5 rounded-full bg-[#dfe4eb]" />
          </span>
          <span>Tuesday, September 10</span>
          <span className="ml-auto grid h-[21px] w-[21px] place-items-center rounded-full bg-[#ffe7c7] text-[8px] font-extrabold text-[#a86726]">
            AM
          </span>
        </div>

        <div className="grid min-h-[330px] grid-cols-[118px_1fr]">
          <aside className="flex flex-col gap-[14px] border-r border-[#edf0f4] p-[20px_13px] text-[9px] text-[#9ba4b0]">
            <b className="mb-[7px] flex items-center gap-[5px] text-[11px] text-[#172238]">
              <Sparkles size={13} className="text-[#284bce]" /> Nivora
            </b>
            <span className="-mx-1.5 -mt-1.5 h-[26px] rounded-[4px] bg-[#edf1ff]" /> Overview
            <span className="h-px bg-[#f0f2f5]" /> My tasks
            <span className="h-px bg-[#f0f2f5]" /> Projects
            <span className="h-px bg-[#f0f2f5]" /> Team
          </aside>

          <div className="p-[24px_25px]">
            <p className="mb-2 text-[7px] font-semibold uppercase tracking-wider text-[#9ba4b0]">
              TUESDAY, SEPTEMBER 10, 2026
            </p>
            <h3 className="m-0 font-display text-[25px] font-medium tracking-[-0.05em] text-[#172238]">
              Good morning, Alex.
            </h3>

            <div className="my-4 grid grid-cols-3 gap-[7px]">
              {[["12", "Open tasks"], ["24", "Completed"], ["3", "Critical"]].map(
                ([value, label]) => (
                  <span
                    key={label}
                    className="flex flex-col gap-[5px] rounded-[5px] bg-[#f8f9fb] p-[10px]"
                  >
                    <b className="font-display text-[18px] font-medium text-[#172238]">
                      {value}
                    </b>
                    <small className="text-[8px] text-[#9ba4b0]">{label}</small>
                  </span>
                )
              )}
            </div>

            <div className="overflow-hidden rounded-[7px] border border-[#edf0f4]">
              <div className="flex flex-col gap-[3px] p-[12px_13px]">
                <b className="text-[11px] text-[#172238]">My tasks</b>
                <small className="text-[8px] text-[#9ba4b0]">Your assigned work</small>
              </div>

              {[
                { title: "Polish onboarding empty states", meta: "NOVA-142 · In progress", due: "Today", done: true },
                { title: "Connect analytics events", meta: "NOVA-138 · Review", due: "Tomorrow", done: false },
                { title: "Build pricing comparison", meta: "WEB-098 · Todo", due: "Sep 14", done: false },
              ].map((task) => (
                <div
                  key={task.title}
                  className="flex items-center gap-2 border-t border-[#f0f2f5] p-[10px_13px] text-[9px] text-[#536174]"
                >
                  <i
                    className={`grid h-4 w-4 flex-shrink-0 place-items-center rounded-full ${
                      task.done ? "border-[#47ae7e] bg-[#47ae7e]" : "border border-[#cbd2dc] bg-white"
                    }`}
                  >
                    {task.done && <Check size={9} className="text-white" strokeWidth={3} />}
                  </i>
                  <span className="flex flex-1 flex-col gap-[3px]">
                    {task.title}
                    <small className="text-[8px] text-[#9ba4b0]">{task.meta}</small>
                  </span>
                  <em className="not-italic text-[8px] text-[#9ba4b0]">{task.due}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-[-4px] top-[31px] z-[2] flex items-center gap-[9px] rounded-[8px] border border-[#e5e8ed] bg-white p-[11px_13px] shadow-[0_12px_30px_#263b7020]">
        <span className="grid h-[31px] w-[31px] place-items-center rounded-[7px] bg-[#e6f7ef] text-[#43a77c]">
          <Check size={14} />
        </span>
        <span>
          <b className="block text-[10px] text-[#354256]">Team momentum</b>
          <small className="mt-[3px] block text-[9px] text-[#9ba4b0]">+18% this week</small>
        </span>
      </div>

      <div className="absolute bottom-[27px] left-[4px] z-[2] flex items-center gap-[9px] rounded-[8px] border border-[#e5e8ed] bg-white p-[11px_13px] shadow-[0_12px_30px_#263b7020]">
        <span className="h-[7px] w-[7px] rounded-full bg-[#75d4a2]" />
        <span>
          <b className="block text-[10px] text-[#354256]">Everything in sync</b>
          <small className="mt-[3px] block text-[9px] text-[#9ba4b0]">Updated just now</small>
        </span>
      </div>
    </div>
  );
}