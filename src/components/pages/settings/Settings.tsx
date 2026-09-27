"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { workspaceApi, authApi, WorkspaceOverview } from "@/services/api";
import { selectRoleAccess } from "@/store/slices/accessSlice";
import { usePermission } from "../../../hooks/usePermission";

export default function Settings() {
  const router = useRouter();
  const roleAccess = useSelector(selectRoleAccess);
  const isOwner = roleAccess.includes("*");
  const canEditSettings = usePermission("edit_settings");

  const [overview, setOverview] = useState<WorkspaceOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [revoking, setRevoking] = useState(false);

  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    try {
      const data = await workspaceApi.getOverview();
      setOverview(data);
      setNameDraft(data.workspace_name);
    } catch {
      // toasted by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSessionCount = useCallback(async () => {
    try {
      const { count } = await authApi.getSessionCount();
      setSessionCount(count);
    } catch {
      // toasted by interceptor
    }
  }, []);

  useEffect(() => {
    loadOverview();
    loadSessionCount();
  }, [loadOverview, loadSessionCount]);

  async function saveWorkspaceName() {
    if (!canEditSettings || !nameDraft.trim() || !overview) return;
    setSavingName(true);
    try {
      const updated = await workspaceApi.updateName(nameDraft.trim());
      setOverview((current) => (current ? { ...current, workspace_name: updated.workspace_name } : current));
      toast.success("Workspace name updated");
    } catch {
      // toasted by interceptor
    } finally {
      setSavingName(false);
    }
  }

  async function handleRevokeAllSessions() {
    setRevoking(true);
    try {
      await authApi.revokeAllSessions();
      toast.success("Signed out of all devices");
      router.push("/login");
    } catch {
      // toasted by interceptor
    } finally {
      setRevoking(false);
    }
  }

  async function handleDeleteWorkspace() {
    if (!overview || confirmName !== overview.workspace_name) return;
    setDeleting(true);
    try {
      await workspaceApi.deleteWorkspace(confirmName);
      toast.success("Workspace deleted");
      router.push("/login");
    } catch {
      // toasted by interceptor
    } finally {
      setDeleting(false);
    }
  }

  if (loading || !overview) {
    return (
      <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px]">
        <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[26px]">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
          Workspace configuration
        </p>
        <h1 className="m-0 font-display text-[42px] max-[760px]:text-[30px] font-medium tracking-[-0.05em] text-[#172238]">
          Settings
        </h1>
        <p className="mt-2 text-[13px] text-[#778293]">
          Configure your workspace and account.
        </p>
      </div>

      <div className="flex flex-col gap-[22px]">
        {/* Workspace overview */}
        <section className="rounded-[9px] border border-[#e5e8ed] bg-white p-[24px] max-[760px]:p-[18px]">
          <div className="mb-[18px]">
            <h2 className="m-0 font-display text-[20px] font-medium tracking-[-0.02em] text-[#172238]">
              Workspace
            </h2>
            <p className="mt-1 text-[12px] text-[#778293]">
              Created{" "}
              {new Date(overview.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              by {overview.owner_name || overview.owner_email}
            </p>
          </div>

          <label className="mb-[20px] flex max-w-[420px] flex-col gap-2 text-[11px] font-bold text-[#536174]">
            Workspace name
            <div className="flex gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                disabled={!canEditSettings}
                className="min-h-[43px] flex-1 rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5] disabled:bg-[#f8f9fb] disabled:text-[#9ba4b0]"
              />
              {canEditSettings && (
                <button
                  onClick={saveWorkspaceName}
                  disabled={savingName || nameDraft.trim() === overview.workspace_name}
                  className="inline-flex min-h-[43px] cursor-pointer items-center gap-2 rounded-[7px] bg-[#284bce] px-[14px] text-[12px] font-bold text-white disabled:opacity-50"
                >
                  {savingName ? "Saving…" : "Save"}
                </button>
              )}
            </div>
          </label>

          <div className="grid grid-cols-4 max-[600px]:grid-cols-2 gap-[14px]">
            <StatCard label="Members" value={overview.member_count} />
            <StatCard label="Roles" value={overview.role_count} />
            <StatCard label="Projects" value={overview.project_count} />
            <StatCard label="Tasks" value={overview.task_count} />
          </div>
        </section>

        {/* Your role & permissions */}
        <section className="rounded-[9px] border border-[#e5e8ed] bg-white p-[24px] max-[760px]:p-[18px]">
          <h2 className="m-0 mb-[14px] font-display text-[20px] font-medium tracking-[-0.02em] text-[#172238]">
            Your role &amp; permissions
          </h2>

          {isOwner ? (
            <p className="rounded-[6px] bg-[#f0f4ff] px-3 py-[10px] text-[12px] font-bold text-[#284bce]">
              Owner — full access to every module
            </p>
          ) : roleAccess.length === 0 ? (
            <p className="text-[12px] text-[#9ba4b0]">No permissions assigned.</p>
          ) : (
            <div className="flex flex-wrap gap-[7px]">
              {roleAccess.map((perm) => (
                <span
                  key={perm}
                  className="rounded-[5px] bg-[#f2f4f7] px-[9px] py-[5px] text-[10px] font-bold text-[#526075]"
                >
                  {perm}
                </span>
              ))}
            </div>
          )}

          <a href="/team?tab=roles" className="mt-[16px] inline-block text-[11px] font-extrabold text-[#284bce]">
            Manage team &amp; roles →
          </a>
        </section>

        {/* Security */}
        <section className="rounded-[9px] border border-[#e5e8ed] bg-white p-[24px] max-[760px]:p-[18px]">
          <h2 className="m-0 mb-[14px] font-display text-[20px] font-medium tracking-[-0.02em] text-[#172238]">
            Security
          </h2>

          <div className="flex items-center justify-between gap-[16px] py-[10px]">
            <span className="flex flex-col gap-[2px]">
              <b className="text-[12px] font-bold text-[#172238]">Active sessions</b>
              <small className="text-[10px] text-[#9ba4b0]">
                {sessionCount === null ? "…" : `${sessionCount} device${sessionCount !== 1 ? "s" : ""} currently signed in`}
              </small>
            </span>
            <button
              onClick={handleRevokeAllSessions}
              disabled={revoking}
              className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384] disabled:opacity-60"
            >
              {revoking ? "Signing out…" : "Sign out of all devices"}
            </button>
          </div>
        </section>

        {/* Danger zone — owner only */}
        {isOwner && (
          <section className="rounded-[9px] border border-[#f3d0d3] bg-[#fff8f8] p-[24px] max-[760px]:p-[18px]">
            <h2 className="m-0 mb-[6px] font-display text-[20px] font-medium tracking-[-0.02em] text-[#a8323c]">
              Danger zone
            </h2>
            <p className="mb-[16px] text-[12px] text-[#a8323c99]">
              Deleting your workspace permanently removes all members, roles, projects, and tasks. This cannot be undone.
            </p>

            <button
              onClick={() => setShowAreYouSure(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[7px] border border-[#d35d67] px-[14px] py-[9px] text-[12px] font-bold text-[#d35d67]"
            >
              Delete workspace
            </button>
          </section>
        )}

        {showAreYouSure && (
          <div
            onClick={() => setShowAreYouSure(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#17223866] p-5"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] rounded-[12px] bg-white p-6 shadow-[0_20px_60px_#17223840]"
            >
              <h3 className="m-0 mb-2 font-display text-[19px] font-medium tracking-[-0.02em] text-[#172238]">
                Delete this workspace?
              </h3>
              <p className="mb-[20px] text-[12px] text-[#778293]">
                This will permanently delete <b>{overview.workspace_name}</b> — every
                member, role, project, task, and file inside it. This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-[9px]">
                <button
                  onClick={() => setShowAreYouSure(false)}
                  className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAreYouSure(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-[7px] bg-[#d35d67] px-[14px] py-[9px] text-[12px] font-bold text-white"
                >
                  Yes, continue
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div
            onClick={() => {
              setShowDeleteConfirm(false);
              setConfirmName("");
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#17223866] p-5"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] rounded-[12px] bg-white p-6 shadow-[0_20px_60px_#17223840]"
            >
              <h3 className="m-0 mb-2 font-display text-[19px] font-medium tracking-[-0.02em] text-[#a8323c]">
                Confirm deletion
              </h3>
              <p className="mb-[16px] text-[12px] text-[#778293]">
                Type <b>{overview.workspace_name}</b> to confirm.
              </p>
              <input
                autoFocus
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                className="mb-[16px] min-h-[43px] w-full rounded-[6px] border border-[#f3d0d3] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#d35d67]"
              />
              <div className="flex justify-end gap-[9px]">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConfirmName("");
                  }}
                  className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteWorkspace}
                  disabled={deleting || confirmName !== overview.workspace_name}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-[7px] bg-[#d35d67] px-[14px] py-[9px] text-[12px] font-bold text-white disabled:opacity-50"
                >
                  {deleting ? "Deleting…" : "Permanently delete workspace"}
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[7px] bg-[#f8f9fb] p-[14px]">
      <b className="block font-display text-[22px] font-medium text-[#172238]">{value}</b>
      <small className="text-[10px] font-bold uppercase tracking-[.06em] text-[#9ba4b0]">{label}</small>
    </div>
  );
}