"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  ClipboardList,
  Check,
  CircleAlert,
  Clock3,
  MoreHorizontal,
} from "lucide-react";
import {
  taskApi,
  projectApi,
  teamApi,
  TaskOut,
  ProjectOut,
  MemberOut,
} from "@/services/api";

const statusStyles: Record<string, string> = {
  "In progress": "bg-[#eaf0ff] text-[#536fd8]",
  Review: "bg-[#fff3de] text-[#bf812d]",
  Todo: "bg-[#f0f2f5] text-[#758192]",
  Done: "bg-[#e7f7ef] text-[#3b9a71]",
};

const priorityStyles: Record<string, { text: string; dot: string }> = {
  High: { text: "text-[#bf812d]", dot: "bg-[#e8a84d]" },
  Critical: { text: "text-[#d65e67]", dot: "bg-[#e26770]" },
  Medium: { text: "text-[#6179bf]", dot: "bg-[#718ae0]" },
  Low: { text: "text-[#3b9a71]", dot: "bg-[#4db484]" },
};

const toneCycle = ["bg-[#7189df]", "bg-[#dc9a67]", "bg-[#a683c9]", "bg-[#6eb28f]", "bg-[#adb6c1]"];
const projectLogoCycle = ["bg-[#7c92ed]", "bg-[#ac86d2]", "bg-[#6eb28f]", "bg-[#dc9a67]"];
const projectBarCycle = ["bg-[#7e92e8]", "bg-[#ad85d0]", "bg-[#6eb28f]", "bg-[#dc9a67]"];

function toneForId(id: number) {
  return toneCycle[id % toneCycle.length];
}

function initialsFor(name: string | null, email: string) {
  if (name) {
    return name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export default function Overview() {
  const [tasks, setTasks] = useState<TaskOut[]>([]);
  const [projects, setProjects] = useState<ProjectOut[]>([]);
  const [members, setMembers] = useState<MemberOut[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksData, projectsData, membersData] = await Promise.all([
        taskApi.listTasks(),
        projectApi.listProjects(),
        teamApi.listMembers(),
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setMembers(membersData);
    } catch {
      // errors already toasted by the gateway interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function toggleTaskDone(task: TaskOut) {
    const nextStatus = task.status === "Done" ? "Todo" : "Done";
    try {
      await taskApi.updateTask(task.id, {
        title: task.title,
        description: task.description ?? undefined,
        project_id: task.project_id,
        status: nextStatus,
        priority: task.priority,
        due: task.due ?? undefined,
        assignee_id: task.assignee_id,
      });
      setTasks((current) =>
        current.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
      );
    } catch {
      // toasted by interceptor
    }
  }

  const openCount = tasks.filter((t) => t.status !== "Done").length;
  const completedCount = tasks.filter((t) => t.status === "Done").length;
  const criticalCount = tasks.filter(
    (t) => t.priority === "Critical" && t.status !== "Done"
  ).length;

  const visibleTasks = tasks.slice(0, 5);
  const visibleProjects = projects.slice(0, 2);
  const visibleMembers = members.slice(0, 5);

  const memberById = (id: number) => members.find((m) => m.id === id);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
        <div className="p-[60px] text-center text-[12px] text-[#9ba4b0]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[29px] flex items-end justify-between max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[16px]">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
            {today}
          </p>
          <h1 className="m-0 font-display text-[34px] max-[760px]:text-[30px] font-medium tracking-[-0.045em] text-[#172238]">
            Good morning<span className="text-[#284bce]">.</span>
          </h1>
          <p className="mt-2 text-[13px] text-[#778293]">
            Here&rsquo;s what&rsquo;s happening across your workspace.
          </p>
        </div>
      </div>

      <section className="mb-[27px] grid grid-cols-4 max-[1100px]:grid-cols-2 gap-[13px] max-[760px]:gap-[8px]">
        {[
          {
            icon: ClipboardList,
            tone: "bg-[#eaf0ff] text-[#536fd8]",
            label: "Open tasks",
            value: openCount,
            note: "Across all projects",
          },
          {
            icon: Check,
            tone: "bg-[#e6f7ef] text-[#43a77c]",
            label: "Completed",
            value: completedCount,
            note: "Total tasks done",
          },
          {
            icon: CircleAlert,
            tone: "bg-[#fdebed] text-[#d76a71]",
            label: "Critical priority",
            value: criticalCount,
            note: criticalCount > 0 ? "Needs attention" : "All clear",
          },
          {
            icon: Clock3,
            tone: "bg-[#f1eafa] text-[#9574ca]",
            label: "Projects",
            value: projects.length,
            note: "Active workspaces",
          },
        ].map(({ icon: Icon, tone, label, value, note }) => (
          <div
            key={label}
            className="flex min-h-[117px] max-[760px]:min-h-[96px] gap-[13px] max-[760px]:gap-[8px] rounded-[9px] border border-[#e5e8ed] bg-white p-[19px] max-[760px]:p-[12px_10px]"
          >
            <span className={`grid h-[31px] w-[31px] flex-shrink-0 place-items-center rounded-[7px] ${tone}`}>
              <Icon size={17} />
            </span>
            <div>
              <small className="mb-[5px] block text-[10px] max-[760px]:text-[9px] text-[#8993a1] leading-[1.15]">
                {label}
              </small>
              <strong className="text-[22px] max-[760px]:text-[20px] tracking-[-0.04em] text-[#172238]">
                {value}
              </strong>
              <p className="mt-[6px] text-[9px] max-[760px]:text-[8px] text-[#9aa3af]">{note}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-[minmax(0,1.65fr)_minmax(290px,0.8fr)] max-[1100px]:grid-cols-1 gap-[22px] max-[760px]:flex max-[760px]:flex-col max-[760px]:gap-[14px]">
        <section className="rounded-[9px] border border-[#e5e8ed] bg-white overflow-hidden">
          <div className="flex items-start justify-between p-[21px_21px_18px] max-[760px]:p-[16px_14px]">
            <div>
              <h2 className="m-0 mb-[5px] text-[14px] max-[760px]:text-[16px] tracking-[-0.02em] text-[#172238]">
                My tasks
              </h2>
              <p className="m-0 text-[11px] text-[#8d97a4]">Your assigned work across all projects.</p>
            </div>
          </div>

          {visibleTasks.length === 0 ? (
            <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">No tasks yet.</div>
          ) : (
            <div className="max-[760px]:overflow-x-auto">
              <div className="grid min-h-[31px] grid-cols-[minmax(200px,2.2fr)_1.05fr_0.9fr_0.9fr_0.65fr_26px] max-[1100px]:grid-cols-[minmax(180px,2fr)_1fr_0.9fr_0.8fr_0.6fr_20px] max-[760px]:min-w-[680px] items-center gap-[10px] border-y border-[#f0f1f3] px-[21px] max-[760px]:px-[14px] text-[9px] font-extrabold uppercase tracking-[.07em] text-[#9aa3af]">
                <span>Task</span>
                <span>Project</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Due date</span>
                <span />
              </div>

              {visibleTasks.map((task) => (
                <div
                  key={task.id}
                  className="grid min-h-[67px] grid-cols-[minmax(200px,2.2fr)_1.05fr_0.9fr_0.9fr_0.65fr_26px] max-[1100px]:grid-cols-[minmax(180px,2fr)_1fr_0.9fr_0.8fr_0.6fr_20px] max-[760px]:min-w-[680px] items-center gap-[10px] border-b border-[#f1f2f4] px-[21px] max-[760px]:px-[14px] text-[11px]"
                >
                  <div className="flex min-w-0 items-center gap-[10px]">
                    <button
                      onClick={() => toggleTaskDone(task)}
                      className={`grid h-4 w-4 flex-shrink-0 cursor-pointer place-items-center rounded-full border ${
                        task.status === "Done"
                          ? "border-[#47ae7e] bg-[#47ae7e]"
                          : "border-[#cbd2dc] bg-white"
                      }`}
                    >
                      {task.status === "Done" && (
                        <Check size={11} className="text-white" strokeWidth={3} />
                      )}
                    </button>
                    <span className="flex min-w-0 flex-col gap-1">
                      <b className="truncate text-[11px] font-bold">{task.title}</b>
                      <small className="text-[9px] text-[#9ba4b0]">{task.code}</small>
                    </span>
                  </div>
                  <span className="truncate text-[#7d8999]">
                    <i className="mr-[6px] inline-block h-[6px] w-[6px] rounded-[2px] bg-[#7d91eb]" />
                    {task.project_name}
                  </span>
                  <span>
                    <em
                      className={`rounded-[4px] px-[7px] py-1 text-[10px] font-bold not-italic ${
                        statusStyles[task.status] ?? statusStyles.Todo
                      }`}
                    >
                      {task.status}
                    </em>
                  </span>
                  <span>
                    <em
                      className={`text-[10px] font-bold not-italic ${
                        (priorityStyles[task.priority] ?? priorityStyles.Medium).text
                      }`}
                    >
                      <i
                        className={`mr-[5px] inline-block h-[5px] w-[5px] rounded-full ${
                          (priorityStyles[task.priority] ?? priorityStyles.Medium).dot
                        }`}
                      />
                      {task.priority}
                    </em>
                  </span>
                  <span className="text-[10px] text-[#8994a3]">{task.due || "No date"}</span>
                  <span />
                </div>
              ))}
            </div>
          )}

          <Link
            href="/tasks"
            className="flex cursor-pointer items-center gap-[9px] p-[18px_21px] text-[11px] font-extrabold text-[#284bce]"
          >
            View all tasks <span className="text-[15px]">→</span>
          </Link>
        </section>

        <aside className="flex flex-col max-[1100px]:grid max-[1100px]:grid-cols-2 max-[760px]:flex max-[760px]:flex-col gap-[22px] max-[760px]:gap-[14px]">
          <section className="rounded-[9px] border border-[#e5e8ed] bg-white">
            <div className="flex items-start justify-between p-[21px_21px_18px] max-[760px]:p-[16px_14px]">
              <div>
                <h2 className="m-0 mb-[5px] text-[14px] tracking-[-0.02em] text-[#172238]">
                  Active projects
                </h2>
                <p className="m-0 text-[11px] text-[#8d97a4]">Workspaces you&rsquo;re part of.</p>
              </div>
            </div>

            {visibleProjects.length === 0 ? (
              <div className="p-[0_21px_20px] text-[11px] text-[#9ba4b0]">No projects yet.</div>
            ) : (
              visibleProjects.map((project, i) => (
                <div
                  key={project.id}
                  className="mx-[21px] max-[760px]:mx-[14px] mb-[14px] rounded-[7px] border border-[#edf0f3] p-[14px]"
                >
                  <div className="flex items-center gap-[9px]">
                    <span
                      className={`grid h-[27px] w-[27px] flex-shrink-0 place-items-center rounded-[6px] text-[12px] font-extrabold text-white ${projectLogoCycle[i % projectLogoCycle.length]}`}
                    >
                      {project.name[0]}
                    </span>
                    <span className="flex flex-1 flex-col gap-[3px] min-w-0">
                      <b className="truncate text-[11px]">{project.name}</b>
                      <small className="truncate text-[9px] text-[#9aa3af]">
                        {project.description || "No description"}
                      </small>
                    </span>
                    <strong className="text-[11px] text-[#6079d7]">{project.progress}%</strong>
                  </div>
                  <div className="my-[14px] h-1 rounded-full bg-[#edf0f3]">
                    <i
                      className={`block h-full rounded-full ${projectBarCycle[i % projectBarCycle.length]}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex pl-[3px]">
                      {project.member_ids.slice(0, 3).map((memberId) => {
                        const member = memberById(memberId);
                        if (!member) return null;
                        return (
                          <span
                            key={memberId}
                            className={`-ml-[3px] grid h-[25px] w-[25px] place-items-center rounded-full border-2 border-white text-[8px] font-extrabold text-white ${toneForId(memberId)}`}
                          >
                            {initialsFor(member.FullName, member.email)}
                          </span>
                        );
                      })}
                      {project.member_ids.length > 3 && (
                        <span className="-ml-[3px] grid h-[25px] w-[25px] place-items-center rounded-full border-2 border-white bg-[#adb6c1] text-[8px] font-extrabold text-white">
                          +{project.member_ids.length - 3}
                        </span>
                      )}
                    </span>
                    <small className="text-[9px] text-[#9aa3af]">{project.tasks} tasks</small>
                  </div>
                </div>
              ))
            )}

            <Link
              href="/projects"
              className="flex cursor-pointer items-center gap-[9px] p-[18px_21px] text-[11px] font-extrabold text-[#284bce]"
            >
              View all projects <span className="text-[15px]">→</span>
            </Link>
          </section>

          <section className="rounded-[9px] border border-[#e5e8ed] bg-white">
            <div className="flex items-start justify-between p-[21px_21px_18px] max-[760px]:p-[16px_14px]">
              <div>
                <h2 className="m-0 mb-[5px] text-[14px] tracking-[-0.02em] text-[#172238]">
                  Team members
                </h2>
                <p className="m-0 text-[11px] text-[#8d97a4]">People working with you.</p>
              </div>
              <Link href="/team" className="cursor-pointer text-[#7b8797]">
                <Plus size={15} />
              </Link>
            </div>

            <div className="p-[0_21px_17px] max-[760px]:p-[0_14px_14px]">
              {visibleMembers.length === 0 ? (
                <div className="text-[11px] text-[#9ba4b0]">No members yet.</div>
              ) : (
                visibleMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-[10px] py-2">
                    <span
                      className={`grid h-[30px] w-[30px] flex-shrink-0 place-items-center rounded-full border-2 border-white text-[10px] font-extrabold text-white ${toneForId(member.id)}`}
                    >
                      {initialsFor(member.FullName, member.email)}
                    </span>
                    <span className="flex flex-1 flex-col gap-[3px] min-w-0">
                      <b className="truncate text-[11px]">{member.FullName || member.email}</b>
                      <small className="truncate text-[9px] text-[#929caa]">{member.role_name}</small>
                    </span>
                    {member.status.toLowerCase() === "active" && (
                      <i className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-[#55bc88] shadow-[0_0_0_3px_#e6f7ee]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}