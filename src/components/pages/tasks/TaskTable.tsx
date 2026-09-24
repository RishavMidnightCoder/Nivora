import { Trash2, Paperclip } from "lucide-react";
import { TaskOut } from "@/services/api";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";

interface TaskTableProps {
  tasks: TaskOut[];
  onEdit: (task: TaskOut) => void;
  onDelete: (id: number) => void;
  onViewAttachments: (task: TaskOut) => void;
}

export default function TaskTable({ tasks, onEdit, onDelete, onViewAttachments }: TaskTableProps) {
  return (
    <div className="max-[760px]:overflow-x-auto">
      <div className="grid min-w-[820px] grid-cols-[minmax(230px,2fr)_1fr_0.9fr_0.9fr_0.8fr_70px_60px] items-center gap-[16px] bg-slate-50 px-[22px] py-[13px] text-[10px] font-extrabold uppercase tracking-[.08em] text-slate-400">
        <span>Task</span>
        <span>Project</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Due date</span>
        <span />
        <span />
      </div>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="grid min-w-[820px] min-h-[70px] grid-cols-[minmax(230px,2fr)_1fr_0.9fr_0.9fr_0.8fr_70px_60px] items-center gap-[16px] border-t border-slate-200 px-[22px]"
        >
          <button
            onClick={() => onEdit(task)}
            className="flex cursor-pointer flex-col items-start gap-[3px] text-left"
          >
            <b className="text-[12px] font-bold text-navy-950">{task.title}</b>
            <small className="text-[10px] text-slate-400">{task.code}</small>
          </button>

          <span className="flex items-center gap-[6px] text-[11px] text-slate-500">
            <i className="h-[6px] w-[6px] rounded-[2px] bg-indigo-500" />
            {task.project_name}
          </span>

          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />

          <span className="text-[10px] text-slate-400">{task.due || "No date"}</span>

          {task.attachment_count > 0 ? (
            <button
              onClick={() => onViewAttachments(task)}
              aria-label={`View ${task.attachment_count} attachment(s) on ${task.title}`}
              className="inline-flex cursor-pointer items-center gap-[4px] justify-self-start rounded-[5px] bg-indigo-50 px-[7px] py-[5px] text-[10px] font-bold text-indigo-600 hover:bg-indigo-100"
            >
              <Paperclip size={11} /> {task.attachment_count}
            </button>
          ) : (
            <span />
          )}

          <button
            onClick={() => onDelete(task.id)}
            aria-label={`Delete ${task.title}`}
            className="cursor-pointer justify-self-end text-slate-300 hover:text-rose-500"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}

      {tasks.length === 0 && (
        <div className="px-[22px] py-[40px] text-center text-[12px] text-slate-400">
          No tasks yet — create your first one.
        </div>
      )}
    </div>
  );
}