"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Layers3,
  TrendingUp,
  CalendarDays,
  CircleAlert,
  ArrowUpRight,
} from "lucide-react";
import { taskApi, projectApi, TaskOut, ProjectOut } from "@/services/api";
import { usePermission } from "../../../hooks/usePermission";

const projectLogoCycle = ["bg-[#7c92ed]", "bg-[#ac86d2]", "bg-[#6eb28f]", "bg-[#dc9a67]"];
const projectBarCycle = ["bg-[#7e92e8]", "bg-[#ad85d0]", "bg-[#6eb28f]", "bg-[#dc9a67]"];

const priorityMeta: Record<string, { text: string; bg: string }> = {
  Critical: { text: "text-[#d65e67]", bg: "bg-[#fdebed]" },
  High: { text: "text-[#bf812d]", bg: "bg-[#fff3de]" },
};

export default function Overview() {
  const [tasks, setTasks] = useState<TaskOut[]>([]);
  const [projects, setProjects] = useState<ProjectOut[]>([]);
  const [loading, setLoading] = useState(true);

  const canViewTasks = usePermission("view_tasks");
  const canViewProjects = usePermission("view_projects");
  const canCreateTasks = usePermission("create_tasks");

  const loadData = useCallback(async () => {
    setLoading(true);
    const [tasksResult, projectsResult] = await Promise.allSettled([
      canViewTasks ? taskApi.listTasks() : Promise.resolve([]),
      canViewProjects ? projectApi.listProjects() : Promise.resolve([]),
    ]);
    setTasks(tasksResult.status === "fulfilled" ? tasksResult.value : []);
    setProjects(projectsResult.status === "fulfilled" ? projectsResult.value : []);
    setLoading(false);
  }, [canViewTasks, canViewProjects]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // The backend's project.progress column is never recalculated when a
  // task's status changes, so it goes stale. Derive real progress here
  // from the tasks we already have — same logic the Projects page uses.
  function progressForProject(projectId: number): number {
    const projectTasks = tasks.filter((t) => t.project_id === projectId);
    if (projectTasks.length === 0) return 0;
    const done = projectTasks.filter((t) => t.status === "Done").length;
    return Math.round((done / projectTasks.length) * 100);
  }

  const averageProgress =
    projects.length === 0
      ? 0
      : Math.round(
          projects.reduce((total, p) => total + progressForProject(p.id), 0) / projects.length,
        );

  const deadlineProjects = projects.filter((p) => p.due);
  const priorityTasks = tasks.filter(
    (t) => (t.priority === "Critical" || t.priority === "High") && t.status !== "Done",
  );

  const statCards = [
    canViewProjects && { icon: Layers3, tone: "bg-[#eaf0ff] text-[#536fd8]", label: "Active projects", value: projects.length },
    canViewProjects && { icon: TrendingUp, tone: "bg-[#f1eafa] text-[#9574ca]", label: "Average progress", value: `${averageProgress}%` },
    canViewProjects && { icon: CalendarDays, tone: "bg-[#fff3de] text-[#bf812d]", label: "Upcoming deadlines", value: deadlineProjects.length },
    canViewTasks && { icon: CircleAlert, tone: "bg-[#fdebed] text-[#d76a71]", label: "Priority tasks", value: priorityTasks.length },
  ].filter(Boolean) as { icon: typeof Layers3; tone: string; label: string; value: string | number }[];

  if (loading) {
    return (
      <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
        <div className="p-[60px] text-center text-[12px] text-[#9ba4b0]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[27px] flex items-end justify-between max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[16px]">
        <div>
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
            Workspace overview
          </p>
          <h1 className="m-0 font-display text-[34px] max-[760px]:text-[30px] font-medium tracking-[-0.045em] text-[#172238]">
            Work at a glance.
          </h1>
          <p className="mt-2 max-w-[520px] text-[13px] text-[#778293]">
            Track project momentum, upcoming deadlines, and the highest-priority work across your workspace.
          </p>
        </div>
      </div>

      {statCards.length > 0 && (
        <section
          className={`mb-[22px] grid gap-[13px] max-[760px]:gap-[8px] ${
            statCards.length >= 4
              ? "grid-cols-4 max-[1100px]:grid-cols-2"
              : statCards.length === 3
                ? "grid-cols-3 max-[1100px]:grid-cols-2"
                : statCards.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-1"
          }`}
        >
          {statCards.map(({ icon: Icon, tone, label, value }) => (
            <div
              key={label}
              className="flex min-h-[92px] items-center gap-[13px] rounded-[9px] border border-[#e5e8ed] bg-white p-[19px] max-[760px]:p-[12px_10px]"
            >
              <span className={`grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[8px] ${tone}`}>
                <Icon size={17} />
              </span>
              <div>
                <small className="mb-[3px] block text-[10px] text-[#8993a1]">{label}</small>
                <strong className="text-[22px] tracking-[-0.04em] text-[#172238]">{value}</strong>
              </div>
            </div>
          ))}
        </section>
      )}

      {(canViewProjects || canViewTasks) && (
        <div
          className={`grid gap-[22px] max-[1100px]:grid-cols-1 max-[760px]:flex max-[760px]:flex-col max-[760px]:gap-[14px] ${
            canViewProjects && canViewTasks ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {canViewProjects && (
            <section className="rounded-[9px] border border-[#e5e8ed] bg-white">
              <div className="flex items-start justify-between p-[21px_21px_18px] max-[760px]:p-[16px_14px]">
                <div>
                  <h2 className="m-0 mb-[5px] text-[14px] tracking-[-0.02em] text-[#172238]">Project progress</h2>
                  <p className="m-0 text-[11px] text-[#8d97a4]">Delivery health across your active projects.</p>
                </div>
                <Link href="/projects" className="inline-flex flex-shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap text-[11px] font-extrabold text-[#284bce]">
                  View projects <ArrowUpRight size={13} />
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="p-[0_21px_24px] text-[11px] text-[#9ba4b0]">No projects yet.</div>
              ) : (
                <div className="pb-[8px]">
                  {projects.slice(0, 5).map((project, i) => {
                    const progress = progressForProject(project.id);
                    return (
                      <Link
                        key={project.id}
                        href="/projects"
                        className="flex items-center gap-[13px] border-t border-[#f1f2f4] p-[14px_21px] max-[760px]:p-[12px_14px] hover:bg-[#f8f9fb]"
                      >
                        <span className={`grid h-[32px] w-[32px] flex-shrink-0 place-items-center rounded-[7px] text-[13px] font-extrabold text-white ${projectLogoCycle[i % projectLogoCycle.length]}`}>
                          {project.name[0]}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
                          <span className="flex flex-col gap-[1px]">
                            <b className="truncate text-[12px]">{project.name}</b>
                            <small className="truncate text-[10px] text-[#9aa3af]">{project.description || "No description"}</small>
                          </span>
                          <span className="h-[5px] rounded-full bg-[#edf0f3]">
                            <i className={`block h-full rounded-full ${projectBarCycle[i % projectBarCycle.length]}`} style={{ width: `${progress}%` }} />
                          </span>
                        </span>
                        <span className="flex flex-shrink-0 flex-col items-end gap-[4px]">
                          <b className="text-[12px] text-[#284bce]">{progress}%</b>
                          <small className="whitespace-nowrap text-[10px] text-[#9aa3af]">Due {project.due || "TBD"}</small>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {canViewTasks && (
            <section className="rounded-[9px] border border-[#e5e8ed] bg-white">
              <div className="flex items-start justify-between p-[21px_21px_18px] max-[760px]:p-[16px_14px]">
                <div>
                  <h2 className="m-0 mb-[5px] text-[14px] tracking-[-0.02em] text-[#172238]">Priority work</h2>
                  <p className="m-0 text-[11px] text-[#8d97a4]">Tasks needing attention first.</p>
                </div>
                <Link href="/tasks" className="inline-flex flex-shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap text-[11px] font-extrabold text-[#284bce]">
                  View tasks <ArrowUpRight size={13} />
                </Link>
              </div>

              {priorityTasks.length === 0 ? (
                <div className="p-[0_21px_24px] text-[11px] text-[#9ba4b0]">Nothing urgent right now.</div>
              ) : (
                <div className="pb-[8px]">
                  {priorityTasks.slice(0, 5).map((task) => {
                    const meta = priorityMeta[task.priority] ?? priorityMeta.High;
                    return (
                      <Link
                        key={task.id}
                        href="/tasks"
                        className="flex items-center gap-[12px] border-t border-[#f1f2f4] p-[13px_21px] max-[760px]:p-[11px_14px] hover:bg-[#f8f9fb]"
                      >
                        <span className={`grid h-[28px] w-[28px] flex-shrink-0 place-items-center rounded-[7px] ${meta.bg} ${meta.text}`}>
                          <CircleAlert size={14} />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                          <b className="truncate text-[12px] font-bold">{task.title}</b>
                          <small className="truncate text-[10px] text-[#9ba4b0]">{task.project_name} · Due {task.due || "No date"}</small>
                        </span>
                        <em className="flex-shrink-0 whitespace-nowrap text-[11px] font-bold not-italic text-[#284bce]">{task.status}</em>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {canViewProjects && deadlineProjects.length > 0 && (
        <section className="mt-[22px] rounded-[9px] border border-[#e5e8ed] bg-white">
          <div className="p-[21px_21px_16px] max-[760px]:p-[16px_14px]">
            <h2 className="m-0 mb-[5px] text-[14px] tracking-[-0.02em] text-[#172238]">Upcoming deadlines</h2>
            <p className="m-0 text-[11px] text-[#8d97a4]">Keep the next deliveries visible.</p>
          </div>
          <div className="grid grid-cols-3 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1 gap-[1px] bg-[#f1f2f4] border-t border-[#f1f2f4]">
            {deadlineProjects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                href="/projects"
                className="flex items-center gap-[11px] bg-white p-[16px_21px] max-[760px]:p-[14px] hover:bg-[#f8f9fb]"
              >
                <CalendarDays size={16} className="flex-shrink-0 text-[#8993a1]" />
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <b className="truncate text-[12px]">{project.due}</b>
                  <small className="truncate text-[10px] text-[#9aa3af]">{project.name}</small>
                </span>
                <ArrowUpRight size={14} className="flex-shrink-0 text-[#9aa3af]" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {!canViewProjects && !canViewTasks && (
        <div className="rounded-[9px] border border-[#e5e8ed] bg-white p-[40px] text-center text-[12px] text-[#9ba4b0]">
          There&apos;s nothing to show here yet — ask your workspace admin for access to projects or tasks.
        </div>
      )}
    </div>
  );
}