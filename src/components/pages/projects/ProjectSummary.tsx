import { Target, CheckCircle2, ListChecks } from "lucide-react";

interface ProjectSummaryProps {
  total: number;
  active: number;
  totalTasks: number;
}

export default function ProjectSummary({ total, active, totalTasks }: ProjectSummaryProps) {
  const cards = [
    { icon: Target, label: "Total projects", value: total, tone: "text-[#284bce] bg-[#edf1ff]" },
    { icon: CheckCircle2, label: "Active delivery", value: active, tone: "text-[#2f9d6f] bg-[#eaf7f1]" },
    { icon: ListChecks, label: "Assigned tasks", value: totalTasks, tone: "text-[#8b5fbf] bg-[#f3edfb]" },
  ];

  return (
    <div className="grid grid-cols-3 gap-[14px] max-[700px]:grid-cols-1">
      {cards.map((card) => (
        <div key={card.label} className="flex items-center gap-[13px] rounded-[9px] border border-[#e5e8ed] bg-white p-[16px]">
          <span className={`grid h-[36px] w-[36px] flex-shrink-0 place-items-center rounded-[8px] ${card.tone}`}>
            <card.icon size={17} />
          </span>
          <span className="flex flex-col">
            <small className="text-[10px] font-bold uppercase tracking-[.06em] text-[#9ba4b0]">{card.label}</small>
            <strong className="text-[19px] text-[#172238]">{card.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}