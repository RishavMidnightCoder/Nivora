import { Users, Check, Clock3, Settings } from "lucide-react";

interface TeamSummaryProps {
  total: number;
  active: number;
  pending: number;
  roleCount: number;
}

export default function TeamSummary({ total, active, pending, roleCount }: TeamSummaryProps) {
  const cards = [
    { icon: Users, tone: "bg-[#eaf0ff] text-[#536fd8]", label: "Total members", value: total, note: "Across your workspace" },
    { icon: Check, tone: "bg-[#e6f7ef] text-[#43a77c]", label: "Active members", value: active, note: "Can access projects" },
    { icon: Clock3, tone: "bg-[#f1eafa] text-[#9574ca]", label: "Pending invites", value: pending, note: "Awaiting response" },
    { icon: Settings, tone: "bg-[#fff0dc] text-[#bd7629]", label: "Roles", value: roleCount, note: "Permission groups" },
  ];

  return (
    <div className="grid grid-cols-4 max-[1100px]:grid-cols-2 gap-[12px]">
      {cards.map(({ icon: Icon, tone, label, value, note }) => (
        <div
          key={label}
          className="flex items-center gap-[12px] rounded-[10px] border border-[#e5e8ed] bg-white p-[17px]"
        >
          <span className={`grid h-[31px] w-[31px] flex-shrink-0 place-items-center rounded-[7px] ${tone}`}>
            <Icon size={17} />
          </span>
          <span className="flex flex-col gap-[3px]">
            <small className="text-[10px] text-[#778293]">{label}</small>
            <strong className="font-display text-[25px] leading-none text-[#172238]">{value}</strong>
            <em className="text-[9px] not-italic text-[#9ba4b0]">{note}</em>
          </span>
        </div>
      ))}
    </div>
  );
}