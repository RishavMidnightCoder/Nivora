import { Settings, Users, MoreHorizontal, ShieldCheck } from "lucide-react";
import { RoleOut } from "@/services/api";
import Tooltip from "@/components/widgets/Tooltip";

interface RolesGridProps {
  roles: RoleOut[];
  onEdit: (role: RoleOut) => void;
  onDelete: (id: number) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export default function RolesGrid({ roles, onEdit, onDelete, canEdit, canDelete }: RolesGridProps) {
  return (
    <div className="grid grid-cols-2 max-[760px]:grid-cols-1 gap-[14px] p-[20px_22px_24px]">
      {roles.map((role) => (
        <div key={role.id} className="rounded-[9px] border border-[#e5e8ed] bg-white p-[17px]">
          <div className="flex items-start gap-[11px]">
            <span className="grid h-[32px] w-[32px] flex-shrink-0 place-items-center rounded-[7px] bg-[#edf1ff] text-[#284bce]">
              <Settings size={16} />
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <b className="text-[13px] text-[#172238]">{role.name}</b>
              <small className="text-[10px] text-[#778293]">{role.description}</small>
            </div>
            {canEdit && (
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
                <ul className="flex flex-col gap-1">
                  {role.permissions.map((perm) => (
                    <li key={perm}>{perm}</li>
                  ))}
                </ul>
              }
            >
              <span className="inline-flex cursor-pointer items-center gap-[5px] rounded-[5px] bg-[#f2f4f7] px-[8px] py-[4px] font-bold text-[#526075]">
                <ShieldCheck size={12} />
                {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}
              </span>
            </Tooltip>
          </div>

          {(canEdit || canDelete) && (
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
                  onClick={() => onDelete(role.id)}
                  className="cursor-pointer text-[10px] font-extrabold text-[#d45b63]"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}