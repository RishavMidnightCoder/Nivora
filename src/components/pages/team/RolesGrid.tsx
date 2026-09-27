import { useState } from "react";
import { Settings, Users, MoreHorizontal, ShieldCheck } from "lucide-react";
import { RoleOut } from "@/services/api";
import Tooltip from "@/components/widgets/Tooltip";
import { PERMISSION_DEFINITIONS } from "../../../utils/permissionModules";

interface RolesGridProps {
  roles: RoleOut[];
  onEdit: (role: RoleOut) => void;
  onDelete: (id: number) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const ALL_PERMISSION_LABELS = PERMISSION_DEFINITIONS.map((p) => p.label);

export default function RolesGrid({ roles, onEdit, onDelete, canEdit, canDelete }: RolesGridProps) {
  const [confirmingRole, setConfirmingRole] = useState<RoleOut | null>(null);

  function confirmDelete() {
    if (!confirmingRole) return;
    onDelete(confirmingRole.id);
    setConfirmingRole(null);
  }

  return (
    <div className="grid grid-cols-2 max-[760px]:grid-cols-1 gap-[14px] p-[20px_22px_24px]">
      {roles.map((role) => {
        const isOwnerRole = role.permissions.includes("*");
        const permissionCount = isOwnerRole ? PERMISSION_DEFINITIONS.length : role.permissions.length;
        const permissionLabels = isOwnerRole ? ALL_PERMISSION_LABELS : role.permissions;

        return (
          <div key={role.id} className="rounded-[9px] border border-[#e5e8ed] bg-white p-[17px]">
            <div className="flex items-start gap-[11px]">
              <span className="grid h-[32px] w-[32px] flex-shrink-0 place-items-center rounded-[7px] bg-[#edf1ff] text-[#284bce]">
                <Settings size={16} />
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <b className="text-[13px] text-[#172238]">{role.name}</b>
                <small className="text-[10px] text-[#778293]">{role.description}</small>
              </div>
              {canEdit && !isOwnerRole && (
                <button
                  onClick={() => onEdit(role)}
                  aria-label={`Edit ${role.name}`}
                  className="cursor-pointer text-[#7b8797]"
                >
                  <MoreHorizontal size={18} />
                </button>
              )}
            </div>

            <div className="my-[20px] flex justify-between gap-[10px] text-[10px] text-[#778293]">
              <span className="inline-flex items-center gap-[5px]">
                <Users size={14} /> {role.member_count} member{role.member_count !== 1 ? "s" : ""}
              </span>

              <Tooltip
                content={
                  isOwnerRole ? (
                    <span>Full access to every module</span>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {permissionLabels.map((perm) => (
                        <li key={perm}>{perm}</li>
                      ))}
                    </ul>
                  )
                }
              >
                <span className="inline-flex cursor-pointer items-center gap-[5px] rounded-[5px] bg-[#f2f4f7] px-[8px] py-[4px] font-bold text-[#526075]">
                  <ShieldCheck size={12} />
                  {isOwnerRole ? "All permissions" : `${permissionCount} permission${permissionCount !== 1 ? "s" : ""}`}
                </span>
              </Tooltip>
            </div>

            {(canEdit || canDelete) && !isOwnerRole && (
              <div className="flex justify-between border-t border-[#e5e8ed] pt-[12px]">
                {canEdit ? (
                  <button
                    onClick={() => onEdit(role)}
                    className="cursor-pointer text-[10px] font-extrabold text-[#284bce]"
                  >
                    Edit role
                  </button>
                ) : (
                  <span />
                )}
                {canDelete && (
                  <button
                    onClick={() => setConfirmingRole(role)}
                    className="cursor-pointer text-[10px] font-extrabold text-[#d45b63]"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}

            {isOwnerRole && (
              <div className="border-t border-[#e5e8ed] pt-[12px] text-[10px] font-medium text-[#a0a9b5]">
                Owner role — always full access, can&apos;t be edited or deleted
              </div>
            )}
          </div>
        );
      })}

      {confirmingRole && (
        <div
          onClick={() => setConfirmingRole(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17223866] p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-[12px] bg-white p-6 shadow-[0_20px_60px_#17223840]"
          >
            <h3 className="m-0 mb-2 font-display text-[19px] font-medium tracking-[-0.02em] text-[#172238]">
              Delete this role?
            </h3>
            <p className="mb-[20px] text-[12px] text-[#778293]">
              <b>{confirmingRole.name}</b> will be permanently deleted. This cannot be
              undone.
              {confirmingRole.member_count > 0 && (
                <>
                  {" "}
                  Note: your backend already blocks deleting a role assigned to
                  members, so this will fail if members still use it.
                </>
              )}
            </p>
            <div className="flex justify-end gap-[9px]">
              <button
                onClick={() => setConfirmingRole(null)}
                className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="inline-flex cursor-pointer items-center gap-2 rounded-[7px] bg-[#d35d67] px-[14px] py-[9px] text-[12px] font-bold text-white"
              >
                Delete role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}