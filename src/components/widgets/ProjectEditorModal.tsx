"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { ProjectOut } from "@/services/api";
import { useLockBodyScroll } from "@/components/elements/useLockBodyScroll";

interface ProjectEditorModalProps {
  project: Partial<ProjectOut> | null;
  onClose: () => void;
  onSave: (payload: { id?: number; name: string; description: string; due: string; color: string }) => void;
}

const colorOptions = [
  { value: "nova", label: "Blue" },
  { value: "web", label: "Purple" },
  { value: "green", label: "Green" },
];

export default function ProjectEditorModal({ project, onClose, onSave }: ProjectEditorModalProps) {
  useLockBodyScroll();

  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [due, setDue] = useState(project?.due ?? "");
  const [color, setColor] = useState(project?.color ?? "nova");

  function handleSubmit() {
    if (!name.trim()) return;
    onSave({ id: project?.id, name, description, due, color });
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 grid place-items-center bg-[#17223866] p-5">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] rounded-[12px] bg-white p-6 shadow-[0_20px_60px_#17223840]"
      >
        <div className="mb-6 flex justify-between">
          <div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
              Project setup
            </p>
            <h2 className="m-0 font-display text-[25px] font-medium tracking-[-0.04em] text-[#172238]">
              {project?.id ? "Edit project" : "Create a project"}
            </h2>
            <p className="mt-2 text-[11px] text-[#778293]">
              Give your team a clear place to plan and deliver work.
            </p>
          </div>
          <button onClick={onClose} className="h-fit cursor-pointer text-[#8290a0]">
            <X size={18} />
          </button>
        </div>

        <label className="mb-4 flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
          Project name
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Website refresh"
            className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
          />
        </label>

        <label className="mb-4 flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project about?"
            className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
          />
        </label>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
            Due date
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
            Color
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none"
            >
              {colorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-[9px]">
          <button
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-[7px] bg-[#284bce] px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c]"
          >
            {project?.id ? "Save changes" : "Create project"} <Check size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}