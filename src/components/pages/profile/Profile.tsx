"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { authApi } from "@/services/api";
import { selectUserData, setUserData } from "@/store/slices/userSlice";
import { selectRoleAccess } from "@/store/slices/accessSlice";
import type { AppDispatch } from "@/store";

function initialsFor(name?: string, email?: string) {
  if (name) {
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return (email || "?").slice(0, 2).toUpperCase();
}

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector(selectUserData);
  const roleAccess = useSelector(selectRoleAccess);
  const isOwner = roleAccess.includes("*");

  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(userData.user_name ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  function startEditing() {
    setNameDraft(userData.user_name ?? "");
    setEditing(true);
  }

  async function saveProfile() {
    if (!nameDraft.trim()) return;
    setSavingProfile(true);
    try {
      const updated = await authApi.updateProfile({ FullName: nameDraft.trim() });
      dispatch(setUserData({ ...userData, user_name: updated.FullName }));
      toast.success("Profile updated");
      setEditing(false);
    } catch {
      // toasted by interceptor
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    setChangingPassword(true);
    try {
      await authApi.changePassword({ current_password: currentPassword, new_password: newPassword });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // toasted by interceptor
    } finally {
      setChangingPassword(false);
    }
  }

  const displayName = userData.user_name || userData.user_email || "";
  const roleLabel = isOwner ? "Owner" : userData.role_name || "Member";

  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[26px]">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
          Your account
        </p>
        <h1 className="m-0 font-display text-[42px] max-[760px]:text-[30px] font-medium tracking-[-0.05em] text-[#172238]">
          Profile
        </h1>
        <p className="mt-2 text-[13px] text-[#778293]">
          Manage your personal details and account security.
        </p>
      </div>

      <div className="flex flex-col gap-[22px]">
        {/* Identity */}
        <section className="rounded-[9px] border border-[#e5e8ed] bg-white p-[24px] max-[760px]:p-[18px]">
          <div className="mb-[28px] flex items-center gap-[16px] max-[600px]:flex-col max-[600px]:items-start">
            <span className="grid h-[56px] w-[56px] flex-shrink-0 place-items-center rounded-full border-2 border-white bg-[#dc9a67] text-[16px] font-extrabold text-white">
              {initialsFor(userData.user_name, userData.user_email)}
            </span>
            <div className="flex-1">
              <h2 className="m-0 font-display text-[20px] font-medium tracking-[-0.02em] text-[#172238]">
                {displayName}
              </h2>
              <p className="mt-1 text-[12px] text-[#778293]">
                {roleLabel} · Nivora workspace
              </p>
            </div>
            {!editing && (
              <button
                onClick={startEditing}
                className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384] max-[600px]:w-full max-[600px]:justify-center"
              >
                Edit profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 max-[600px]:grid-cols-1 gap-[16px]">
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              Full name
              <input
                value={editing ? nameDraft : displayName}
                onChange={(e) => setNameDraft(e.target.value)}
                disabled={!editing}
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5] disabled:bg-[#f8f9fb] disabled:text-[#9ba4b0]"
              />
            </label>
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              Email
              <input
                value={userData.user_email ?? ""}
                disabled
                type="email"
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none disabled:bg-[#f8f9fb] disabled:text-[#9ba4b0]"
              />
            </label>
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              Role
              <input
                value={roleLabel}
                disabled
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none disabled:bg-[#f8f9fb] disabled:text-[#9ba4b0]"
              />
            </label>
          </div>

          {editing && (
            <div className="mt-[24px] flex justify-end gap-[9px]">
              <button
                onClick={() => setEditing(false)}
                className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384]"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={savingProfile || !nameDraft.trim()}
                className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-[7px] bg-[#284bce] px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c] disabled:opacity-50"
              >
                {savingProfile ? "Saving…" : "Save profile"}
              </button>
            </div>
          )}
        </section>

        {/* Security */}
        <section className="rounded-[9px] border border-[#e5e8ed] bg-white p-[24px] max-[760px]:p-[18px]">
          <h2 className="m-0 mb-[16px] font-display text-[20px] font-medium tracking-[-0.02em] text-[#172238]">
            Change password
          </h2>

          <div className="grid grid-cols-2 max-[600px]:grid-cols-1 gap-[16px]">
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174] col-span-2 max-[600px]:col-span-1">
              Current password
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
              />
            </label>
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              New password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
              />
            </label>
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              Confirm new password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
              />
            </label>
          </div>

          <div className="mt-[24px] flex justify-end">
            <button
              onClick={handleChangePassword}
              disabled={changingPassword || !currentPassword || !newPassword}
              className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-[7px] bg-[#284bce] px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c] disabled:opacity-50"
            >
              {changingPassword ? "Updating…" : "Update password"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}