"use client";

import { useMemo, useState } from "react";
import { X, Paperclip, Trash2, Image as ImageIcon, Video } from "lucide-react";
import { useLockBodyScroll } from "../elements/useLockBodyScroll";
import { TaskOut, ProjectOut, MemberOut, TaskAttachmentOut, taskApi } from "@/services/api";
import { toast } from "sonner";

interface TaskEditorModalProps {
  task: TaskOut | null;
  projects: ProjectOut[];
  members: MemberOut[];
  existingAttachments: TaskAttachmentOut[];
  onClose: () => void;
  onSave: (payload: {
    title: string;
    description: string;
    project_id: number;
    status: string;
    priority: string;
    due: string;
    assignee_id: number | null;
  }, pendingFiles: File[]) => void;
  onDeleteAttachment: (attachmentId: number) => void;
  saving?: boolean;
}

const STATUSES = ["Todo", "In progress", "Review", "Done"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export default function TaskEditorModal({
  task,
  projects,
  members,
  existingAttachments,
  onClose,
  onSave,
  onDeleteAttachment,
  saving,
}: TaskEditorModalProps) {
  useLockBodyScroll();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [projectId, setProjectId] = useState<number | "">(task?.project_id ?? projects[0]?.id ?? "");
  const [status, setStatus] = useState(task?.status ?? "Todo");
  const [priority, setPriority] = useState(task?.priority ?? "Medium");
  const [due, setDue] = useState(task?.due ?? "");
  const [assigneeId, setAssigneeId] = useState<number | "">(task?.assignee_id ?? "");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const selectedProject = projects.find((p) => p.id === projectId);

  const projectMembers = useMemo(() => {
    if (!selectedProject) return [];
    return members.filter((m) => selectedProject.member_ids.includes(m.id));
  }, [selectedProject, members]);

  function handleProjectChange(newProjectId: number) {
    setProjectId(newProjectId);
    const newProject = projects.find((p) => p.id === newProjectId);
    if (assigneeId !== "" && newProject && !newProject.member_ids.includes(Number(assigneeId))) {
      setAssigneeId("");
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => {
      const isMedia = f.type.startsWith("image/") || f.type.startsWith("video/");
      if (!isMedia) toast.error(`${f.name} is not an image or video`);
      if (f.size > 25 * 1024 * 1024) toast.error(`${f.name} exceeds 25MB`);
      return isMedia && f.size <= 25 * 1024 * 1024;
    });
    setPendingFiles((current) => [...current, ...valid]);
    e.target.value = "";
  }

  function removePendingFile(index: number) {
    setPendingFiles((current) => current.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!title.trim() || projectId === "") return;
    onSave(
      {
        title,
        description,
        project_id: Number(projectId),
        status,
        priority,
        due,
        assignee_id: assigneeId === "" ? null : Number(assigneeId),
      },
      pendingFiles
    );
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17223866] p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-[520px] flex-col rounded-[12px] bg-white shadow-[0_20px_60px_#17223840]"
      >
        <div className="flex justify-between p-6 pb-0">
          <div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-slate-400">
              Task management
            </p>
            <h2 className="m-0 font-display text-[25px] font-medium tracking-[-0.04em] text-navy-950">
              {task ? "Edit task" : "Create task"}
            </h2>
          </div>
          <button onClick={onClose} className="h-fit cursor-pointer text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <label className="mb-4 flex flex-col gap-2 text-[11px] font-bold text-slate-500">
            Task title
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to get done?"
              className="min-h-[43px] rounded-[6px] border border-slate-200 px-3 text-[13px] font-normal text-foreground outline-none focus:border-indigo-600"
            />
          </label>

          <label className="mb-4 flex flex-col gap-2 text-[11px] font-bold text-slate-500">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              rows={3}
              className="rounded-[6px] border border-slate-200 px-3 py-2 text-[13px] font-normal text-foreground outline-none focus:border-indigo-600"
            />
          </label>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2 text-[11px] font-bold text-slate-500">
              Project
              <select
                value={projectId}
                onChange={(e) => handleProjectChange(Number(e.target.value))}
                className="min-h-[43px] rounded-[6px] border border-slate-200 px-3 text-[13px] font-normal text-foreground outline-none"
              >
                {projects.length === 0 && <option value="">No projects yet</option>}
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-[11px] font-bold text-slate-500">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="min-h-[43px] rounded-[6px] border border-slate-200 px-3 text-[13px] font-normal text-foreground outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-[11px] font-bold text-slate-500">
              Priority
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="min-h-[43px] rounded-[6px] border border-slate-200 px-3 text-[13px] font-normal text-foreground outline-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-[11px] font-bold text-slate-500">
              Due date
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="min-h-[43px] rounded-[6px] border border-slate-200 px-3 text-[13px] font-normal text-foreground outline-none focus:border-indigo-600"
              />
            </label>
          </div>

          <label className="mb-4 flex flex-col gap-2 text-[11px] font-bold text-slate-500">
            Assignee
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value === "" ? "" : Number(e.target.value))}
              disabled={projectMembers.length === 0}
              className="min-h-[43px] rounded-[6px] border border-slate-200 px-3 text-[13px] font-normal text-foreground outline-none disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">Unassigned</option>
              {projectMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.FullName || m.email}
                </option>
              ))}
            </select>
            {selectedProject && projectMembers.length === 0 && (
              <span className="text-[10px] font-normal text-slate-400">
                No members assigned to this project yet.
              </span>
            )}
          </label>

          <div className="flex flex-col gap-2 text-[11px] font-bold text-slate-500">
            Attachments
            <label className="inline-flex w-fit cursor-pointer items-center gap-[7px] rounded-[6px] border border-dashed border-slate-300 px-3 py-2 text-[12px] font-bold text-indigo-600 hover:bg-indigo-50">
              <Paperclip size={14} /> Add screenshot or video
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            {existingAttachments.length > 0 && (
              <div className="mt-2 flex flex-col gap-[6px]">
                {existingAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-[8px] rounded-[6px] border border-slate-200 px-[10px] py-[7px] text-[11px] text-foreground"
                  >
                    {att.file_type === "image" ? <ImageIcon size={13} /> : <Video size={13} />}
                    <a href={att.file_url} target="_blank" rel="noreferrer" className="flex-1 truncate hover:underline">
                      {att.file_name}
                    </a>
                    <button
                      onClick={() => onDeleteAttachment(att.id)}
                      aria-label={`Remove ${att.file_name}`}
                      className="cursor-pointer text-slate-300 hover:text-rose-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {pendingFiles.length > 0 && (
              <div className="mt-2 flex flex-col gap-[6px]">
                {pendingFiles.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="flex items-center gap-[8px] rounded-[6px] border border-indigo-200 bg-indigo-50 px-[10px] py-[7px] text-[11px] text-indigo-700"
                  >
                    {file.type.startsWith("image/") ? <ImageIcon size={13} /> : <Video size={13} />}
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-[10px] opacity-70">Pending upload</span>
                    <button
                      onClick={() => removePendingFile(i)}
                      aria-label={`Remove ${file.name}`}
                      className="cursor-pointer text-indigo-400 hover:text-rose-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-[9px] p-6 pt-4">
          <button
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-slate-200 px-[10px] py-[7px] text-[11px] font-bold text-slate-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-[7px] bg-indigo-600 px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#4f46e52c] disabled:opacity-60"
          >
            {saving ? "Saving…" : task ? "Save changes" : "Create task"}
          </button>
        </div>
      </div>
    </div>
  );
}