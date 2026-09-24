const priorityStyles: Record<string, { text: string; dot: string }> = {
  Low: { text: "text-emerald-600", dot: "bg-emerald-500" },
  Medium: { text: "text-indigo-600", dot: "bg-indigo-500" },
  High: { text: "text-amber-700", dot: "bg-amber-500" },
  Critical: { text: "text-rose-600", dot: "bg-rose-500" },
};

export default function TaskPriorityBadge({ priority }: { priority: string }) {
  const style = priorityStyles[priority] ?? priorityStyles.Medium;
  return (
    <em className={`inline-flex items-center gap-[5px] text-[10px] font-bold not-italic ${style.text}`}>
      <i className={`h-[5px] w-[5px] rounded-full ${style.dot}`} />
      {priority}
    </em>
  );
}