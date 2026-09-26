"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import ProjectSummary from "./ProjectSummary";
import ProjectsGrid from "./ProjectsGrid";
import ProjectDetail from "./ProjectDetail";
import ProjectEditorModal from "../../widgets/ProjectEditorModal";
import { projectApi, teamApi, taskApi, ProjectOut, MemberOut, TaskOut } from "@/services/api";
import { usePermission } from "../../../hooks/usePermission";

export interface ProjectStats {
  taskCount: number;
  progress: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectOut[]>([]);
  const [members, setMembers] = useState<MemberOut[]>([]);
  const [tasks, setTasks] = useState<TaskOut[]>([]);
  const [loading, setLoading] = useState(true);

  const canCreateProjects = usePermission("create_projects");
  const canEditProjects = usePermission("edit_projects");
  const canDeleteProjects = usePermission("delete_projects");
  const canAddProjectMembers = usePermission("add_project_members");

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<ProjectOut> | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const data = await projectApi.listProjects();
      setProjects(data);
    } catch {
      // toasted by interceptor
    }
  }, []);

  const loadMembers = useCallback(async () => {
    try {
      const data = await teamApi.listMembers();
      // only active members can be assigned to a project
      setMembers(data.filter((m) => m.status.toLowerCase() === "active"));
    } catch {
      // toasted by interceptor
    }
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const data = await taskApi.listTasks();
      setTasks(data);
    } catch {
      // toasted by interceptor
    }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([loadProjects(), loadMembers(), loadTasks()]);
      setLoading(false);
    }
    init();
  }, [loadProjects, loadMembers, loadTasks]);

  const projectStats = useMemo(() => {
    const map: Record<number, ProjectStats> = {};
    for (const project of projects) {
      const projectTasks = tasks.filter((t) => t.project_id === project.id);
      const done = projectTasks.filter((t) => t.status === "Done").length;
      map[project.id] = {
        taskCount: projectTasks.length,
        progress: projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0,
      };
    }
    return map;
  }, [projects, tasks]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;

  function openCreate() {
    if (!canCreateProjects) return;
    setEditingProject(null);
    setShowEditor(true);
  }

  function openEdit(project: ProjectOut) {
    if (!canEditProjects) return;
    setEditingProject(project);
    setShowEditor(true);
  }

  async function saveProject(payload: { id?: number; name: string; description: string; due: string; color: string }) {
    if (payload.id ? !canEditProjects : !canCreateProjects) return;
    try {
      if (payload.id) {
        await projectApi.updateProject(payload.id, {
          name: payload.name,
          description: payload.description,
          due: payload.due,
          color: payload.color,
        });
        toast.success("Project updated");
      } else {
        await projectApi.createProject({
          name: payload.name,
          description: payload.description,
          due: payload.due,
          color: payload.color,
        });
        toast.success("Project created");
      }
      setShowEditor(false);
      setEditingProject(null);
      loadProjects();
    } catch {
      // toasted by interceptor
    }
  }

  async function deleteProject(id: number) {
    if (!canDeleteProjects) return;
    try {
      await projectApi.deleteProject(id);
      toast.success("Project deleted");
      setProjects((current) => current.filter((p) => p.id !== id));
      if (selectedProjectId === id) setSelectedProjectId(null);
    } catch {
      // toasted by interceptor
    }
  }

  async function toggleMember(memberId: number) {
    if (!selectedProject || !canAddProjectMembers) return;
    const isAssigned = selectedProject.member_ids.includes(memberId);
    try {
      const updated = isAssigned
        ? await projectApi.removeProjectMember(selectedProject.id, memberId)
        : await projectApi.addProjectMember(selectedProject.id, memberId);

      setProjects((current) => current.map((p) => (p.id === updated.id ? updated : p)));
    } catch {
      // toasted by interceptor
    }
  }

  const activeCount = projects.filter((p) => (projectStats[p.id]?.progress ?? 0) < 100).length;
  const totalTasks = tasks.length;

  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[26px] flex items-start justify-between gap-4 max-[600px]:flex-col">
        <div>
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
            Workspace portfolio
          </p>
          <h1 className="m-0 font-display text-[42px] max-[760px]:text-[30px] font-medium tracking-[-0.05em] text-[#172238]">
            Projects
          </h1>
          <p className="mt-2 text-[13px] text-[#778293]">
            Track progress across every project you are part of.
          </p>
        </div>
        {!selectedProject && canCreateProjects && (
          <button
            onClick={openCreate}
            className="inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-2 rounded-[7px] bg-[#284bce] px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c] max-[600px]:w-full"
          >
            <Plus size={16} /> New project
          </button>
        )}
      </div>

      {!selectedProject && (
        <div className="mb-[18px]">
          <ProjectSummary total={projects.length} active={activeCount} totalTasks={totalTasks} />
        </div>
      )}

      <section className="rounded-[9px] border border-[#e5e8ed] bg-white">
        {loading ? (
          <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">Loading…</div>
        ) : selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            stats={projectStats[selectedProject.id] ?? { taskCount: 0, progress: 0 }}
            members={members}
            onBack={() => setSelectedProjectId(null)}
            onEdit={openEdit}
            onToggleMember={toggleMember}
            canEdit={canEditProjects}
            canManageMembers={canAddProjectMembers}
          />
        ) : projects.length === 0 ? (
          <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">No projects yet.</div>
        ) : (
          <ProjectsGrid
            projects={projects}
            stats={projectStats}
            onOpen={setSelectedProjectId}
            onDelete={deleteProject}
            canDelete={canDeleteProjects}
          />
        )}
      </section>

      {showEditor && (editingProject?.id ? canEditProjects : canCreateProjects) && (
        <ProjectEditorModal
          project={editingProject}
          onClose={() => {
            setShowEditor(false);
            setEditingProject(null);
          }}
          onSave={saveProject}
        />
      )}
    </div>
  );
}