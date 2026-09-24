interface Task {
  name: string;
  status: "Done" | "In progress";
}

const tasks: Task[] = [
  { name: "Design system audit", status: "Done" },
  { name: "Ship mobile beta", status: "In progress" },
];

const statusStyles: Record<Task["status"], string> = {
  Done: "text-emerald-400",
  "In progress": "text-amber-400",
};

export default function SprintCard() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-white/10 bg-navy-800/60 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-medium text-white">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Sprint 24
        </div>
        <span className="text-slate-300">72% complete</span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[72%] rounded-full bg-lavender-300" />
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {tasks.map((task) => (
          <li
            key={task.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-slate-200">{task.name}</span>
            <span className={`font-medium ${statusStyles[task.status]}`}>
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}