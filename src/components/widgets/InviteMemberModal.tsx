"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { RoleOut } from "@/services/api";
import { useLockBodyScroll } from "@/components/elements/useLockBodyScroll";

interface InviteMemberModalProps {
  roles: RoleOut[];
  onClose: () => void;
  onInvite: (payload: { email: string; role_id: number }) => void;
  inviting?: boolean;
}

export default function InviteMemberModal({ roles, onClose, onInvite, inviting }: InviteMemberModalProps) {
  useLockBodyScroll();

  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<number | "">(roles[0]?.id ?? "");

  function handleSubmit() {
    if (!email.trim() || roleId === "") return;
    onInvite({ email, role_id: Number(roleId) });
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-[#17223866] p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] rounded-[12px] bg-white p-6 shadow-[0_20px_60px_#17223840]"
      >
        <div className="mb-6 flex justify-between">
          <div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
              Team invite
            </p>
            <h2 className="m-0 font-display text-[25px] font-medium tracking-[-0.04em] text-[#172238]">
              Invite a teammate
            </h2>
            <p className="mt-2 text-[11px] text-[#778293]">
              They will receive an email with a secure invite link.
            </p>
          </div>
          <button onClick={onClose} className="h-fit cursor-pointer text-[#8290a0]">
            <X size={18} />
          </button>
        </div>

        <label className="mb-4 flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
          Work email
          <input
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jordan@company.com"
            className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
          />
        </label>

        <label className="mb-4 flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
          Role
          <select
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-6 flex justify-end gap-[9px]">
          <button
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={inviting}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-[7px] bg-[#284bce] px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c] disabled:opacity-60"
          >
            {inviting ? "Sending…" : "Send invite"} <UserPlus size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}