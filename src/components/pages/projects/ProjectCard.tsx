import { Trash2 } from "lucide-react";
import { ProjectOut } from "@/services/api";
import { toneFor } from "./utils";
import type { ProjectStats } from "./Projects";

interface ProjectCardProps {
  project: ProjectOut;
  stats: ProjectStats;
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProjectCard({ project, stats, onOpen, onDelete }: ProjectCardProps) {
  const tone = toneFor(project.color);

  return (
    <article
      onClick={() => onOpen(project.id)}
      className="cursor-pointer rounded-[10px] border border-[#e5e8ed] bg-white p-[18px] transition-shadow hover:shadow-[0_6px_18px_#17223814]"
    >
      <div className="mb-[14px] flex items-start justify-between">
        <span className={`grid h-[36px] w-[36px] place-items-center rounded-[8px] text-[15px] font-extrabold ${tone.bg} ${tone.text}`}>
          {project.name[0]}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          aria-label={`Delete ${project.name}`}
          className="cursor-pointer text-[#c3c9d1] hover:text-[#d35d67]"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <p className="mb-1 text-[10px] font-bold uppercase tracking-[.06em] text-[#9ba4b0]">{project.description}</p>
      <h3 className="mb-[14px] text-[15px] font-bold text-[#172238]">{project.name}</h3>

      <div className="mb-[14px]">
        <div className="mb-[6px] flex items-center justify-between text-[10px] font-bold text-[#778293]">
          <span>Progress</span>
          <span>{stats.progress}%</span>
        </div>
        <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#f2f4f7]">
          <i className={`block h-full rounded-full ${tone.bar}`} style={{ width: `${stats.progress}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-bold text-[#778293]">
        <span>{project.member_ids.length} members</span>
        <span>{stats.taskCount} tasks</span>
        <span>Due {project.due || "TBD"}</span>
      </div>
    </article>
  );
}