"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import TaskTable from "./TaskTable";
import TaskEditorModal from "../../widgets/TaskEditorModal";
import TaskAttachmentGallery from "../../widgets/TaskAttachmentGallery";
import {
  taskApi,
  projectApi,
  teamApi,
  TaskOut,
  ProjectOut,
  MemberOut,
  TaskAttachmentOut,
} from "@/services/api";

const STATUS_TABS = ["All", "Todo", "In progress", "Review", "Done"];

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskOut[]>([]);
  const [projects, setProjects] = useState<ProjectOut[]>([]);
  const [members, setMembers] = useState<MemberOut[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("All");
  const [showEditor, setShowEditor] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskOut | null>(null);
  const [attachments, setAttachments] = useState<TaskAttachmentOut[]>([]);
  const [saving, setSaving] = useState(false);

  const [viewingTask, setViewingTask] = useState<TaskOut | null>(null);
  const [galleryAttachments, setGalleryAttachments] = useState<TaskAttachmentOut[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const data = await taskApi.listTasks();
      setTasks(data);
    } catch {
      // toasted by interceptor
    }
  }, []);

  const loadProjectsAndMembers = useCallback(async () => {
    try {
      const [projectData, memberData] = await Promise.all([
        projectApi.listProjects(),
        teamApi.listMembers(),
      ]);
      setProjects(projectData);
      setMembers(memberData.filter((m) => m.status.toLowerCase() === "active"));
    } catch {
      // toasted by interceptor
    }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([loadTasks(), loadProjectsAndMembers()]);
      setLoading(false);
    }
    init();
  }, [loadTasks, loadProjectsAndMembers]);

  const visibleTasks =
    activeTab === "All" ? tasks : tasks.filter((t) => t.status === activeTab);

  function openCreate() {
    if (projects.length === 0) {
      toast.error("Create a project before adding tasks");
      return;
    }
    setEditingTask(null);
    setAttachments([]);
    setShowEditor(true);
  }

  async function viewAttachments(task: TaskOut) {
    setViewingTask(task);
    setGalleryLoading(true);
    try {
      const data = await taskApi.listAttachments(task.id);
      setGalleryAttachments(data);
    } catch {
      setGalleryAttachments([]);
    } finally {
      setGalleryLoading(false);
    }
  }

  async function openEdit(task: TaskOut) {
    setEditingTask(task);
    setShowEditor(true);
    try {
      const data = await taskApi.listAttachments(task.id);
      setAttachments(data);
    } catch {
      setAttachments([]);
    }
  }

  async function deleteTask(id: number) {
    try {
      await taskApi.deleteTask(id);
      toast.success("Task deleted");
      setTasks((current) => current.filter((t) => t.id !== id));
    } catch {
      // toasted by interceptor
    }
  }

  async function saveTask(
    payload: {
      title: string;
      description: string;
      project_id: number;
      status: string;
      priority: string;
      due: string;
      assignee_id: number | null;
    },
    pendingFiles: File[],
  ) {
    setSaving(true);
    try {
      let taskId: number;

      if (editingTask) {
        await taskApi.updateTask(editingTask.id, payload);
        taskId = editingTask.id;
        toast.success("Task updated");
      } else {
        const created = await taskApi.createTask(payload);
        taskId = created.id;
        toast.success("Task created");
      }

      for (const file of pendingFiles) {
        try {
          await taskApi.uploadAttachment(taskId, file);
        } catch {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      setShowEditor(false);
      setEditingTask(null);
      setAttachments([]);
      loadTasks();
    } catch {
      // toasted by interceptor
    } finally {
      setSaving(false);
    }
  }

  async function deleteAttachment(attachmentId: number) {
    if (!editingTask) return;
    try {
      await taskApi.deleteAttachment(editingTask.id, attachmentId);
      setAttachments((current) => current.filter((a) => a.id !== attachmentId));
      toast.success("Attachment removed");
    } catch {
      // toasted by interceptor
    }
  }

  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[26px] flex items-end justify-between gap-4 max-[760px]:flex-col max-[760px]:items-start">
        <div>
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-slate-400">
            Your work queue
          </p>
          <h1 className="m-0 font-display text-[42px] max-[760px]:text-[30px] font-medium tracking-[-0.05em] text-navy-950">
            My tasks
          </h1>
          <p className="mt-2 text-[13px] text-slate-500">
            Stay on top of every assignment and priority.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-[7px] bg-indigo-600 px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#4f46e52c] max-[760px]:w-full max-[760px]:justify-center"
        >
          <Plus size={16} /> New task
        </button>
      </div>

      <section className="rounded-[9px] border border-slate-200 bg-white">
        <div className="flex items-center gap-[5px] border-b border-slate-200 p-[20px_22px_16px] max-[760px]:overflow-x-auto">
          {STATUS_TABS.map((tab) => {
            const count =
              tab === "All"
                ? tasks.length
                : tasks.filter((t) => t.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer whitespace-nowrap rounded-[6px] px-3 py-[9px] text-[12px] font-bold ${
                  activeTab === tab
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500"
                }`}
              >
                {tab}{" "}
                <span className="ml-[5px] text-[10px] opacity-75">{count}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="px-[22px] py-[40px] text-center text-[12px] text-slate-400">
            Loading…
          </div>
        ) : (
          <TaskTable
            tasks={visibleTasks}
            onEdit={openEdit}
            onDelete={deleteTask}
            onViewAttachments={viewAttachments}
          />
        )}
      </section>

      {showEditor && (
        <TaskEditorModal
          task={editingTask}
          projects={projects}
          members={members}
          existingAttachments={attachments}
          onClose={() => {
            setShowEditor(false);
            setEditingTask(null);
            setAttachments([]);
          }}
          onSave={saveTask}
          onDeleteAttachment={deleteAttachment}
          saving={saving}
        />
      )}

      {viewingTask && (
        <TaskAttachmentGallery
          task={viewingTask}
          attachments={galleryAttachments}
          loading={galleryLoading}
          onClose={() => {
            setViewingTask(null);
            setGalleryAttachments([]);
          }}
        />
      )}
    </div>
  );
}