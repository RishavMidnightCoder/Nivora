"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import TeamSummary from "./TeamSummary";
import MembersTable from "./MembersTable";
import RolesGrid from "./RolesGrid";
import InviteMemberModal from "../../widgets/InviteMemberModal";
import RoleEditorModal from "../../widgets/RoleEditorModal";
import MemberEditorModal from "../../widgets/memberEditorModal";
import { teamApi, MemberOut, RoleOut } from "@/services/api";
import { usePermission } from "../../../hooks/usePermission";

export default function Team() {
  const [members, setMembers] = useState<MemberOut[]>([]);
  const [roles, setRoles] = useState<RoleOut[]>([]);
  const [loading, setLoading] = useState(true);

  const canViewMembers = usePermission("view_members");
  const canViewRoles = usePermission("view_roles");
  const canCreateMembers = usePermission("create_members");
  const canEditMembers = usePermission("edit_members");
  const canDeleteMembers = usePermission("delete_members");
  const canToggleMembers = usePermission("activate_deactivate_members");
  const canCreateRoles = usePermission("create_roles");
  const canEditRoles = usePermission("edit_roles");
  const canDeleteRoles = usePermission("delete_roles");

  const [tab, setTab] = useState<"members" | "roles">(
    canViewMembers ? "members" : "roles",
  );

  const [showInvite, setShowInvite] = useState(false);
  const [inviting, setInviting] = useState(false);

  const [editingRole, setEditingRole] = useState<Partial<RoleOut> | null>(null);
  const [showRoleEditor, setShowRoleEditor] = useState(false);
  const [savingRole, setSavingRole] = useState(false);

  const [editingMember, setEditingMember] = useState<MemberOut | null>(null);
  const [savingMember, setSavingMember] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [membersData, rolesData] = await Promise.all([
        canViewMembers ? teamApi.listMembers() : Promise.resolve([]),
        canViewRoles ? teamApi.listRoles() : Promise.resolve([]),
      ]);
      setMembers(membersData);
      setRoles(rolesData);
    } catch {
      // errors already toasted by the gateway interceptor
    } finally {
      setLoading(false);
    }
  }, [canViewMembers, canViewRoles]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function toggleMemberStatus(id: number) {
    if (!canToggleMembers) return;
    try {
      await teamApi.toggleStatus(id);
      setMembers((current) =>
        current.map((m) => (m.id === id ? { ...m, status: "deactivated" } : m)),
      );
    } catch {
      // toasted by interceptor
    }
  }

  async function removeMember(id: number) {
    if (!canDeleteMembers) return;
    try {
      await teamApi.removeMember(id);
      setMembers((current) => current.filter((m) => m.id !== id));
    } catch {
      // toasted by interceptor
    }
  }

  async function cancelInvite(id: number) {
    if (!canDeleteMembers) return;
    try {
      await teamApi.cancelInvite(id);
      setMembers((current) =>
        current.map((m) => (m.id === id ? { ...m, status: "inactive" } : m)),
      );
      toast.success("Invite cancelled");
    } catch {
      // toasted by interceptor
    }
  }

  async function sendInvite(id: number) {
    if (!canCreateMembers) return;
    const member = members.find((m) => m.id === id);
    if (!member) return;
    try {
      await teamApi.inviteMember({
        email: member.email,
        role_id: member.role_id,
      });
      toast.success("Invite sent");
      loadData();
    } catch {
      // toasted by interceptor
    }
  }

  function openEditMember(id: number) {
    if (!canEditMembers) return;
    const member = members.find((m) => m.id === id);
    if (member) setEditingMember(member);
  }

  async function saveMemberRole(roleId: number) {
    if (!editingMember || !canEditMembers) return;
    setSavingMember(true);
    try {
      await teamApi.updateMember(editingMember.id, { role_id: roleId });
      toast.success("Member updated");
      setEditingMember(null);
      loadData();
    } catch {
      // toasted by interceptor
    } finally {
      setSavingMember(false);
    }
  }

  async function inviteMember(payload: { email: string; role_id: number }) {
    if (!canCreateMembers) return;
    setInviting(true);
    try {
      await teamApi.inviteMember(payload);
      toast.success("Invite sent");
      setShowInvite(false);
      loadData();
    } catch {
      // toasted by interceptor
    } finally {
      setInviting(false);
    }
  }

  async function saveRole(payload: {
    id?: number;
    name: string;
    description: string;
    permissions: string[];
  }) {
    if (payload.id ? !canEditRoles : !canCreateRoles) return;
    setSavingRole(true);
    try {
      if (payload.id) {
        await teamApi.updateRole(payload.id, {
          name: payload.name,
          description: payload.description,
          permissions: payload.permissions,
        });
      } else {
        await teamApi.createRole({
          name: payload.name,
          description: payload.description,
          permissions: payload.permissions,
        });
      }
      setShowRoleEditor(false);
      setEditingRole(null);
      loadData();
    } catch {
      // toasted by interceptor
    } finally {
      setSavingRole(false);
    }
  }

  async function deleteRole(id: number) {
    if (!canDeleteRoles) return;
    try {
      await teamApi.deleteRole(id);
      setRoles((current) => current.filter((r) => r.id !== id));
    } catch {
      // toasted by interceptor
    }
  }

  const activeCount = members.filter(
    (m) => m.status.toLowerCase() === "active",
  ).length;
  const pendingCount = members.filter(
    (m) => m.status.toLowerCase() === "pending",
  ).length;

  const canCreateInCurrentTab =
    tab === "members" ? canCreateMembers : canCreateRoles;

  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[26px]">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
          People &amp; permissions
        </p>
        <h1 className="m-0 font-display text-[42px] max-[760px]:text-[30px] font-medium tracking-[-0.05em] text-[#172238]">
          Team
        </h1>
        <p className="mt-2 text-[13px] text-[#778293]">
          Collaborate with the people moving work forward.
        </p>
      </div>

      <div className="mb-[18px]">
        <TeamSummary
          total={members.length}
          active={activeCount}
          pending={pendingCount}
          roleCount={roles.length}
        />
      </div>

      <section className="rounded-[9px] border border-[#e5e8ed] bg-white">
        <div className="flex items-center justify-between border-b border-[#e5e8ed] p-[20px_22px_16px] max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-3">
          <div className="flex items-center gap-[5px] max-[760px]:w-full">
            {canViewMembers && (
              <button
                onClick={() => setTab("members")}
                className={`cursor-pointer rounded-[6px] px-3 py-[9px] text-[12px] font-bold max-[760px]:flex-1 ${
                  tab === "members"
                    ? "bg-[#edf1ff] text-[#284bce]"
                    : "text-[#778293]"
                }`}
              >
                Members{" "}
                <span className="ml-[5px] text-[10px] opacity-75">
                  {members.length}
                </span>
              </button>
            )}
            {canViewRoles && (
              <button
                onClick={() => setTab("roles")}
                className={`cursor-pointer rounded-[6px] px-3 py-[9px] text-[12px] font-bold max-[760px]:flex-1 ${
                  tab === "roles"
                    ? "bg-[#edf1ff] text-[#284bce]"
                    : "text-[#778293]"
                }`}
              >
                Roles{" "}
                <span className="ml-[5px] text-[10px] opacity-75">
                  {roles.length}
                </span>
              </button>
            )}
          </div>

          {canCreateInCurrentTab && (
            <button
              onClick={() =>
                tab === "members"
                  ? setShowInvite(true)
                  : (setEditingRole({
                      name: "",
                      description: "",
                      permissions: [],
                    }),
                    setShowRoleEditor(true))
              }
              className="inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-2 rounded-[7px] bg-[#284bce] px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c] max-[760px]:w-full"
            >
              {tab === "members" ? "Invite member" : "Create role"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">
            Loading…
          </div>
        ) : tab === "members" ? (
          !canViewMembers ? (
            <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">
              You don&apos;t have permission to view members.
            </div>
          ) : members.length === 0 ? (
            <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">
              No members yet.
            </div>
          ) : (
            <MembersTable
              members={members}
              onToggleStatus={toggleMemberStatus}
              onRemove={removeMember}
              onEdit={openEditMember}
              onCancelInvite={cancelInvite}
              onSendInvite={sendInvite}
              canEdit={canEditMembers}
              canDelete={canDeleteMembers}
              canToggleStatus={canToggleMembers}
              canInvite={canCreateMembers}
            />
          )
        ) : !canViewRoles ? (
          <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">
            You don&apos;t have permission to view roles.
          </div>
        ) : roles.length === 0 ? (
          <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">
            No roles yet.
          </div>
        ) : (
          <RolesGrid
            roles={roles}
            onEdit={(role) => {
              setEditingRole(role);
              setShowRoleEditor(true);
            }}
            onDelete={deleteRole}
            canEdit={canEditRoles}
            canDelete={canDeleteRoles}
          />
        )}
      </section>

      {showInvite && canCreateMembers && (
        <InviteMemberModal
          roles={roles}
          onClose={() => setShowInvite(false)}
          onInvite={inviteMember}
          inviting={inviting}
        />
      )}
      {showRoleEditor && (editingRole?.id ? canEditRoles : canCreateRoles) && (
        <RoleEditorModal
          role={editingRole}
          onClose={() => {
            setShowRoleEditor(false);
            setEditingRole(null);
          }}
          onSave={saveRole}
          saving={savingRole}
        />
      )}
      {editingMember && canEditMembers && (
        <MemberEditorModal
          member={editingMember}
          roles={roles}
          onClose={() => setEditingMember(null)}
          onSave={saveMemberRole}
          saving={savingMember}
        />
      )}
    </div>
  );
}