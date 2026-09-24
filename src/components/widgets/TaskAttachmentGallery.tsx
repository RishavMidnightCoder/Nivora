"use client";

import { X, Image as ImageIcon, Video, Download } from "lucide-react";
import { TaskOut, TaskAttachmentOut } from "@/services/api";
import { useLockBodyScroll } from "../elements/useLockBodyScroll";

interface TaskAttachmentGalleryProps {
  task: TaskOut;
  attachments: TaskAttachmentOut[];
  loading: boolean;
  onClose: () => void;
}

export default function TaskAttachmentGallery({
  task,
  attachments,
  loading,
  onClose,
}: TaskAttachmentGalleryProps) {
  useLockBodyScroll();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17223866] p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-[640px] flex-col rounded-[12px] bg-white shadow-[0_20px_60px_#17223840]"
      >
        <div className="flex justify-between p-6 pb-4">
          <div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-slate-400">
              {task.code}
            </p>
            <h2 className="m-0 font-display text-[21px] font-medium tracking-[-0.04em] text-navy-950">
              {task.title}
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Screenshots and recordings shared on this task.
            </p>
          </div>
          <button onClick={onClose} className="h-fit cursor-pointer text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="py-[40px] text-center text-[12px] text-slate-400">Loading…</div>
          ) : attachments.length === 0 ? (
            <div className="py-[40px] text-center text-[12px] text-slate-400">
              No attachments on this task yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-[12px] max-[500px]:grid-cols-1">
              {attachments.map((att) => (
                <div key={att.id} className="overflow-hidden rounded-[8px] border border-slate-200">
                  {att.file_type === "image" ? (
                    <a href={att.file_url} target="_blank" rel="noreferrer">
                      <img
                        src={att.file_url}
                        alt={att.file_name}
                        className="h-[160px] w-full object-cover"
                      />
                    </a>
                  ) : (
                    <video src={att.file_url} controls className="h-[160px] w-full bg-black object-contain" />
                  )}
                  <div className="flex items-center gap-[6px] border-t border-slate-200 px-[10px] py-[8px]">
                    {att.file_type === "image" ? (
                      <ImageIcon size={13} className="text-slate-400" />
                    ) : (
                      <Video size={13} className="text-slate-400" />
                    )}
                    <span className="flex-1 truncate text-[11px] text-foreground">{att.file_name}</span>
                    <a
                      href={att.file_url}
                      download={att.file_name}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Download ${att.file_name}`}
                      className="cursor-pointer text-slate-300 hover:text-indigo-600"
                    >
                      <Download size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}