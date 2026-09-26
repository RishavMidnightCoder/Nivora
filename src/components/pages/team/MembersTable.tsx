import { Trash2, Pencil, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { MemberOut } from "@/services/api";

const statusStyles: Record<string, { text: string; dot: string }> = {
  active: { text: "text-[#47ae7e]", dot: "bg-[#75d4a2]" },
  pending: { text: "text-[#bd7629]", dot: "bg-[#e6a047]" },
  inactive: { text: "text-[#d65e67]", dot: "bg-[#e26770]" },
};

function normalizeStatus(status: string) {
  return status.toLowerCase();
}

function displayStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

const toneCycle = [
  "bg-[#7189df]",
  "bg-[#dc9a67]",
  "bg-[#a683c9]",
  "bg-[#6eb28f]",
  "bg-[#adb6c1]",
];

function toneForId(id: number) {
  return toneCycle[id % toneCycle.length];
}

function initialsFor(member: MemberOut) {
  if (member.FullName) {
    return member.FullName.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return member.email.slice(0, 2).toUpperCase();
}

interface MembersTableProps {
  members: MemberOut[];
  onToggleStatus: (id: number) => void;
  onRemove: (id: number) => void;
  onEdit: (id: number) => void;
  onCancelInvite?: (id: number) => Promise<void>;
  onSendInvite?: (id: number) => Promise<void>;
  /** activate_deactivate_members permission is required to remove a member entirely */
  canDelete: boolean;
  /** edit_members permission */
  canEdit: boolean;
  /** activate_deactivate_members permission */
  canToggleStatus: boolean;
  /** create_members permission (covers both first invite and re-invite) */
  canInvite: boolean;
}

export default function MembersTable({
  members,
  onToggleStatus,
  onRemove,
  onEdit,
  onCancelInvite,
  onSendInvite,
  canDelete,
  canEdit,
  canToggleStatus,
  canInvite,
}: MembersTableProps) {
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  async function handleSendInvite(id: number) {
    setLoadingIds((prev) => new Set(prev).add(id));
    try {
      await onSendInvite?.(id);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleCancelInvite(id: number) {
    setLoadingIds((prev) => new Set(prev).add(id));
    try {
      await onCancelInvite?.(id);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  const showActionsColumn = canEdit || canDelete || canToggleStatus || canInvite;

  return (
    <div className="max-[760px]:overflow-x-auto">
      <div className="grid min-w-[760px] grid-cols-[minmax(230px,1.6fr)_1fr_0.9fr_1fr_155px] items-center gap-[16px] bg-[#fafbfc] px-[22px] py-[13px] text-[10px] font-extrabold uppercase tracking-[.08em] text-[#9ba4b0]">
        <span>Member</span>
        <span>Role</span>
        <span>Status</span>
        <span>Joined</span>
        <span />
      </div>

      {members.map((member) => {
        const status = normalizeStatus(member.status);
        const style = statusStyles[status] ?? statusStyles.inactive;
        const isPending = status === "pending";

        return (
          <div
            key={member.id}
            className="grid min-w-[760px] min-h-[75px] grid-cols-[minmax(230px,1.6fr)_1fr_0.9fr_1fr_155px] items-center gap-[16px] border-t border-[#e5e8ed] px-[22px]"
          >
            <div className="flex items-center gap-[11px]">
              <span
                className={`grid h-[30px] w-[30px] flex-shrink-0 place-items-center rounded-full border-2 border-white text-[10px] font-extrabold text-white ${toneForId(member.id)}`}
              >
                {initialsFor(member)}
              </span>
              <span className="flex flex-col gap-1">
                <b className="text-[12px] text-[#172238]">
                  {member.FullName || "Pending invite"}
                </b>
                <small className="text-[10px] text-[#778293]">
                  {member.email}
                </small>
              </span>
            </div>

            <span className="w-fit rounded-[5px] bg-[#f2f4f7] px-[9px] py-[6px] text-[10px] font-bold text-[#526075]">
              {member.role_name}
            </span>

            <span
              className={`inline-flex w-fit items-center gap-[6px] text-[10px] font-bold ${style.text}`}
            >
              <i className={`h-[6px] w-[6px] rounded-full ${style.dot}`} />
              {displayStatus(status)}
            </span>

            <span className="text-[10px] text-[#778293]">
              {new Date(member.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            {showActionsColumn ? (
              <div className="flex items-center justify-end gap-[9px]">
                {isPending
                  ? canDelete && (
                      <button
                        onClick={() => handleCancelInvite(member.id)}
                        disabled={loadingIds.has(member.id)}
                        className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap text-[10px] font-extrabold text-[#d35d67] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingIds.has(member.id) ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          "Cancel invite"
                        )}
                      </button>
                    )
                  : status === "active"
                    ? canToggleStatus && (
                        <button
                          onClick={() => onToggleStatus(member.id)}
                          className="cursor-pointer whitespace-nowrap text-[10px] font-extrabold text-[#284bce]"
                        >
                          Deactivate
                        </button>
                      )
                    : canInvite && (
                        <button
                          onClick={() => handleSendInvite(member.id)}
                          disabled={loadingIds.has(member.id)}
                          className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap text-[10px] font-extrabold text-[#284bce] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loadingIds.has(member.id) ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <>
                              <Send size={11} /> Send invite
                            </>
                          )}
                        </button>
                      )}
                {canEdit && (
                  <button
                    onClick={() => onEdit(member.id)}
                    aria-label={`Edit ${member.email}`}
                    className="cursor-pointer text-[#c3c9d1] hover:text-[#284bce]"
                  >
                    <Pencil size={15} />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onRemove(member.id)}
                    aria-label={`Delete ${member.email}`}
                    className="cursor-pointer text-[#c3c9d1] hover:text-[#d35d67]"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ) : (
              <span />
            )}
          </div>
        );
      })}
    </div>
  );
}