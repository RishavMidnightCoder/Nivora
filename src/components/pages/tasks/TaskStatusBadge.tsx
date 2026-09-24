const statusStyles: Record<string, string> = {
  Todo: "bg-slate-100 text-slate-500",
  "In progress": "bg-indigo-50 text-indigo-600",
  Review: "bg-amber-50 text-amber-700",
  Done: "bg-emerald-50 text-emerald-600",
};

export default function TaskStatusBadge({ status }: { status: string }) {
  return (
    <em className={`inline-block rounded-[4px] px-[7px] py-[4px] text-[10px] font-bold not-italic ${statusStyles[status] ?? "bg-slate-100 text-slate-500"}`}>
      {status}
    </em>
  );
}