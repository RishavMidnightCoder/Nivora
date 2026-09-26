import { ArrowLeft, Check, Clock3 } from "lucide-react";
import { ProjectOut, MemberOut } from "@/services/api";
import { toneFor } from "./utils";
import type { ProjectStats } from "./Projects";

interface ProjectDetailProps {
  project: ProjectOut;
  stats: ProjectStats;
  members: MemberOut[];
  onBack: () => void;
  onEdit: (project: ProjectOut) => void;
  onToggleMember: (memberId: number) => void;
  /** edit_projects permission */
  canEdit: boolean;
  /** add_project_members permission */
  canManageMembers: boolean;
}

export default function ProjectDetail({
  project,
  stats,
  members,
  onBack,
  onEdit,
  onToggleMember,
  canEdit,
  canManageMembers,
}: ProjectDetailProps) {
  const tone = toneFor(project.color);

  return (
    <div className="p-[20px_22px_28px]">
      <button
        onClick={onBack}
        className="mb-[18px] inline-flex cursor-pointer items-center gap-[6px] text-[11px] font-bold text-[#778293] hover:text-[#284bce]"
      >
        <ArrowLeft size={14} /> Back to projects
      </button>

      <div className="mb-[22px] flex items-start justify-between gap-4 max-[600px]:flex-col">
        <div className="flex items-start gap-[13px]">
          <span className={`grid h-[44px] w-[44px] flex-shrink-0 place-items-center rounded-[10px] text-[18px] font-extrabold ${tone.bg} ${tone.text}`}>
            {project.name[0]}
          </span>
          <div>
            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#a0a9b5]">
              Project workspace
            </p>
            <h2 className="text-[22px] font-bold text-[#172238]">{project.name}</h2>
            <p className="mt-1 text-[12px] text-[#778293]">{project.description}</p>
          </div>
        </div>
        {canEdit && (
          <button
            onClick={() => onEdit(project)}
            className="cursor-pointer whitespace-nowrap rounded-[7px] border border-[#e5e8ed] px-[13px] py-[8px] text-[12px] font-bold text-[#526075] hover:bg-[#f7f8fa]"
          >
            Edit project
          </button>
        )}
      </div>

      <div className="mb-[22px] grid grid-cols-4 gap-[12px] max-[700px]:grid-cols-2">
        {[
          { label: "Progress", value: `${stats.progress}%` },
          { label: "Tasks", value: stats.taskCount },
          { label: "Due date", value: project.due || "Not set" },
          { label: "Members", value: project.member_ids.length },
        ].map((metric) => (
          <div key={metric.label} className="rounded-[9px] border border-[#e5e8ed] bg-[#fafbfc] p-[14px]">
            <small className="text-[10px] font-bold uppercase tracking-[.06em] text-[#9ba4b0]">{metric.label}</small>
            <strong className="mt-1 block text-[17px] text-[#172238]">{metric.value}</strong>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-[16px] max-[900px]:grid-cols-1">
        <section className="rounded-[10px] border border-[#e5e8ed] bg-white">
          <div className="border-b border-[#e5e8ed] p-[16px_18px]">
            <h3 className="text-[13px] font-bold text-[#172238]">Project members</h3>
            <p className="mt-1 text-[11px] text-[#778293]">
              {canManageMembers
                ? "Check a teammate to assign them, uncheck to remove them from this project."
                : "People assigned to this project."}
            </p>
          </div>
          <div className="max-h-[320px] overflow-y-auto p-[10px_14px]">
            {members.length === 0 ? (
              <p className="p-[14px] text-center text-[11px] text-[#9ba4b0]">No active team members yet.</p>
            ) : (
              members.map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center gap-[11px] rounded-[7px] px-[6px] py-[9px] ${
                    canManageMembers ? "cursor-pointer hover:bg-[#f7f8fa]" : ""
                  }`}
                >
                  <span className="grid h-[28px] w-[28px] flex-shrink-0 place-items-center rounded-full bg-[#7189df] text-[10px] font-extrabold text-white">
                    {(member.FullName || member.email).slice(0, 2).toUpperCase()}
                  </span>
                  <span className="flex flex-1 flex-col">
                    <b className="text-[12px] text-[#172238]">{member.FullName || member.email}</b>
                    <small className="text-[10px] text-[#778293]">{member.role_name}</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={project.member_ids.includes(member.id)}
                    onChange={() => canManageMembers && onToggleMember(member.id)}
                    disabled={!canManageMembers}
                    className="h-[15px] w-[15px] accent-[#284bce] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[10px] border border-[#e5e8ed] bg-white p-[18px]">
          <h3 className="mb-1 text-[13px] font-bold text-[#172238]">Project overview</h3>
          <p className="mb-[14px] text-[11px] text-[#778293]">Track delivery health at a glance.</p>

          <div className="mb-[16px] h-[7px] w-full overflow-hidden rounded-full bg-[#f2f4f7]">
            <i className={`block h-full rounded-full ${tone.bar}`} style={{ width: `${stats.progress}%` }} />
          </div>

          <div className="flex flex-col gap-[10px] text-[12px] text-[#526075]">
            <span className="inline-flex items-center gap-[8px]">
              <Check size={14} className="text-[#2f9d6f]" /> Project created
            </span>
            <span className="inline-flex items-center gap-[8px]">
              {project.member_ids.length > 0 ? (
                <Check size={14} className="text-[#2f9d6f]" />
              ) : (
                <Clock3 size={14} className="text-[#bd7629]" />
              )}
              Team assigned
            </span>
            <span className="inline-flex items-center gap-[8px]">
              {stats.taskCount > 0 ? (
                <Check size={14} className="text-[#2f9d6f]" />
              ) : (
                <Clock3 size={14} className="text-[#bd7629]" />
              )}
              Tasks ready to plan
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}