"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { RoleOut } from "@/services/api";
import {
  applicationModules,
  PERMISSION_DEFINITIONS,
  PermissionKey,
  getModuleKeys,
} from "../../utils/permissionModules";
import { useLockBodyScroll } from "@/components/elements/useLockBodyScroll";

interface RoleEditorModalProps {
  role: Partial<RoleOut> | null;
  onClose: () => void;
  onSave: (payload: {
    id?: number;
    name: string;
    description: string;
    permissions: string[];
  }) => void;
  saving?: boolean;
}

export default function RoleEditorModal({
  role,
  onClose,
  onSave,
  saving,
}: RoleEditorModalProps) {
  useLockBodyScroll();

  // The Owner role is stored as permissions: ["*"] (see
  // src/users/controller.py::_get_or_create_owner_role). It always has
  // every permission and can't be edited down — editing it here would
  // let someone accidentally lock themselves out of their own workspace.
  const isOwnerRole = (role?.permissions ?? []).includes("*");

  const allPermissionKeys = PERMISSION_DEFINITIONS.map((p) => p.key);

  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [permissions, setPermissions] = useState<Set<string>>(
    new Set(isOwnerRole ? allPermissionKeys : role?.permissions ?? []),
  );

  function togglePermission(key: PermissionKey) {
    if (isOwnerRole) return;
    setPermissions((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleModule(group: string) {
    if (isOwnerRole) return;
    const moduleKeys = getModuleKeys(group);
    const allSelected = moduleKeys.every((k) => permissions.has(k));

    setPermissions((current) => {
      const next = new Set(current);
      if (allSelected) {
        moduleKeys.forEach((k) => next.delete(k));
      } else {
        moduleKeys.forEach((k) => next.add(k));
      }
      return next;
    });
  }

  function handleSubmit() {
    if (!name.trim()) return;
    onSave({
      id: role?.id,
      name,
      description,
      // Preserve the wildcard on save instead of expanding it into every
      // individual key — keeps it in sync automatically if new
      // permissions are added later, and matches what the backend expects.
      permissions: isOwnerRole ? ["*"] : Array.from(permissions),
    });
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#17223866] p-5 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] max-h-[85vh] flex flex-col rounded-[12px] bg-white shadow-[0_20px_60px_#17223840]"
      >
        <div className="flex justify-between p-6 pb-0">
          <div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
              Role management
            </p>
            <h2 className="m-0 font-display text-[25px] font-medium tracking-[-0.04em] text-[#172238]">
              {role?.id ? "Edit role" : "Create role"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-fit cursor-pointer text-[#8290a0]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <label className="mb-4 flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
            Role name
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Campaign Viewer"
              disabled={isOwnerRole}
              className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5] disabled:cursor-not-allowed disabled:bg-[#f8f9fb] disabled:text-[#9ba4b0]"
            />
          </label>

          <label className="mb-4 flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
            Description
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Manage engineering delivery"
              disabled={isOwnerRole}
              className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5] disabled:cursor-not-allowed disabled:bg-[#f8f9fb] disabled:text-[#9ba4b0]"
            />
          </label>

          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#536174]">
              Permissions
            </span>
            <small className="text-[10px] text-[#9ba4b0]">
              {isOwnerRole ? "All permissions (Owner)" : `${permissions.size} selected`}
            </small>
          </div>

          {isOwnerRole && (
            <p className="mb-3 rounded-[6px] bg-[#f0f4ff] px-3 py-2 text-[11px] text-[#536174]">
              The Owner role always has full access and can&apos;t be changed.
            </p>
          )}

          <div className="flex flex-col gap-4">
            {applicationModules.map((group) => {
              const modulePerms = PERMISSION_DEFINITIONS.filter(
                (p) => p.group === group,
              );
              if (modulePerms.length === 0) return null;

              const moduleKeys = getModuleKeys(group);
              const allSelected = moduleKeys.every((k) =>
                permissions.has(k),
              );

              return (
                <div
                  key={group}
                  className="overflow-hidden rounded-[8px] border border-[#e5e8ed]"
                >
                  <div className="flex items-center justify-between bg-[#f8f9fb] px-4 py-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-[#536174]">
                      {group}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleModule(group)}
                      disabled={isOwnerRole}
                      className="cursor-pointer text-[10px] font-bold text-[#284bce] disabled:cursor-not-allowed disabled:text-[#c3c9d1]"
                    >
                      {allSelected ? "Deselect all" : "Select all"}
                    </button>
                  </div>

                  {modulePerms.map((perm, index) => (
                    <label
                      key={perm.key}
                      className={`flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#f8f9fb] ${
                        isOwnerRole ? "cursor-not-allowed" : "cursor-pointer"
                      } ${
                        index !== modulePerms.length - 1
                          ? "border-b border-[#e5e8ed]"
                          : ""
                      }`}
                    >
                      <span className="flex flex-col gap-[2px]">
                        <b className="text-[12px] font-bold text-[#172238]">
                          {perm.label}
                        </b>
                        <small className="text-[10px] text-[#9ba4b0]">
                          {perm.description}
                        </small>
                      </span>
                      <input
                        type="checkbox"
                        aria-label={perm.label}
                        checked={permissions.has(perm.key)}
                        disabled={isOwnerRole}
                        onChange={() =>
                          togglePermission(perm.key as PermissionKey)
                        }
                        className="h-[15px] w-[15px] flex-shrink-0 accent-[#284bce] disabled:cursor-not-allowed"
                      />
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-[9px] p-6 pt-4">
          <button
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || isOwnerRole}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-[7px] bg-[#284bce] px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c] disabled:opacity-60"
          >
            {saving ? "Saving…" : role?.id ? "Save changes" : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}