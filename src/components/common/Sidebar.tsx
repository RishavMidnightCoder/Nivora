"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Target,
  Users,
  Settings,
  LogIn,
  ChevronDown,
  Sparkles,
  UserCircle,
  X,
} from "lucide-react";
import { signOut } from "@/services/session";
import { taskApi } from "@/services/api";
import { usePermission } from "../../hooks/usePermission";
import { useSelector } from "react-redux";
import { selectUserData } from "@/store/slices/userSlice";

interface SidebarProps {
  profileMenuOpen: boolean;
  onCloseProfileMenu: () => void;
}

export default function Sidebar({
  profileMenuOpen,
  onCloseProfileMenu,
}: SidebarProps) {
  const pathname = usePathname();
  const [openTaskCount, setOpenTaskCount] = useState<number | null>(null);

  const canViewTasks = usePermission("view_tasks");
  const canViewProjects = usePermission("view_projects");
  const canViewTeamPage = usePermission("view_team_page");
  const canViewSettings = usePermission("view_settings");

  const userData = useSelector(selectUserData);
  const displayName = userData.user_name || userData.user_email || "";
  const initials = displayName
    ? displayName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard", visible: true },
    { icon: ClipboardList, label: "My tasks", href: "/tasks", visible: canViewTasks },
    { icon: Target, label: "Projects", href: "/projects", visible: canViewProjects },
    { icon: Users, label: "Team", href: "/team", visible: canViewTeamPage },
  ].filter((item) => item.visible);

  const loadTaskCount = useCallback(async () => {
    if (!canViewTasks) return;
    try {
      const tasks = await taskApi.listTasks();
      setOpenTaskCount(tasks.filter((t) => t.status !== "Done").length);
    } catch {
      // sidebar count is non-critical — fail silently, no toast needed
    }
  }, [canViewTasks]);

  useEffect(() => {
    loadTaskCount();
  }, [loadTaskCount, pathname]);

  useEffect(() => {
    if (profileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [profileMenuOpen]);

  // A user clicking "Sign out" is a deliberate, successful action — not
  // an expired session, so this must NOT trigger session.ts's default
  // "Your session has expired" toast (that message is reserved for the
  // automatic 401 -> "app:logout" path in AuthListener).
  function handleManualSignOut() {
    signOut(false);
  }

  return (
    <>
      {profileMenuOpen && (
        <div
          onClick={onCloseProfileMenu}
          className="fixed inset-0 z-30 hidden bg-black/30 max-[760px]:block"
        />
      )}

      {profileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 hidden rounded-t-[20px] bg-white p-[18px_14px] pb-[max(18px,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_#18223030] max-[760px]:block">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#172238]">Menu</span>
            <button
              onClick={onCloseProfileMenu}
              aria-label="Close menu"
              className="cursor-pointer text-[#8c96a3]"
            >
              <X size={18} />
            </button>
          </div>

          <Link
            href="/profile"
            onClick={onCloseProfileMenu}
            className="flex items-center gap-[9px] rounded-[8px] bg-[#f6f7f9] p-[9px_10px] mb-3"
          >
            <span className="grid h-[30px] w-[30px] flex-shrink-0 place-items-center rounded-full border-2 border-white bg-[#dc9a67] text-[9px] font-extrabold text-white">
              {initials}
            </span>
            <span className="flex flex-1 flex-col gap-[3px]">
              <b className="text-[12px] text-[#172238]">{displayName}</b>
              <small className="text-[10px] text-[#a0a9b5]">
                {userData.role_name || "Member"}
              </small>
            </span>
            <ChevronDown size={15} className="text-[#8c96a3]" />
          </Link>

          <Link
            href="/profile"
            onClick={onCloseProfileMenu}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-[7px] px-3 text-left text-[13px] font-bold text-[#778293]"
          >
            <UserCircle size={18} /> Profile
          </Link>
          {canViewSettings && (
            <Link
              href="/settings"
              onClick={onCloseProfileMenu}
              className="flex min-h-[44px] w-full items-center gap-3 rounded-[7px] px-3 text-left text-[13px] font-bold text-[#778293]"
            >
              <Settings size={18} /> Settings
            </Link>
          )}
          <button
            onClick={() => {
              onCloseProfileMenu();
              handleManualSignOut();
            }}
            className="flex min-h-[44px] w-full cursor-pointer items-center gap-3 rounded-[7px] px-3 text-left text-[13px] font-bold text-[#778293]"
          >
            <LogIn size={18} /> Sign out
          </button>
        </div>
      )}

      <aside
        className={`
          flex w-[238px] max-[1100px]:w-[210px] flex-shrink-0 flex-col
          bg-white p-[25px_14px_18px] border-r border-[#e5e8ed]
          max-[760px]:fixed max-[760px]:z-20 max-[760px]:inset-x-0 max-[760px]:bottom-0
          max-[760px]:w-full max-[760px]:h-[68px] max-[760px]:p-[8px_10px]
          max-[760px]:pb-[max(8px,env(safe-area-inset-bottom))]
          max-[760px]:border-r-0 max-[760px]:border-t max-[760px]:shadow-[0_-8px_24px_#18223012]
          ${profileMenuOpen ? "max-[760px]:hidden" : ""}
        `}
      >
        <div className="mb-[34px] max-[760px]:hidden inline-flex items-center gap-2 px-[13px] text-[17px] font-bold tracking-[-0.04em] text-[#172238]">
          <Sparkles size={17} className="text-[#91aaff]" />
          Nivora
        </div>

        {/* Desktop-only profile card: hidden on mobile (bottom bar) — FIX */}
        <Link
          href="/profile"
          className="mb-3 flex items-center gap-[9px] rounded-[8px] bg-[#f6f7f9] p-[9px_10px] max-[760px]:hidden"
        >
          <span className="grid h-[30px] w-[30px] flex-shrink-0 place-items-center rounded-full border-2 border-white bg-[#dc9a67] text-[9px] font-extrabold text-white">
            {initials}
          </span>
          <span className="flex flex-1 flex-col gap-[3px]">
            <b className="text-[12px] text-[#172238]">{displayName}</b>
            <small className="text-[10px] text-[#a0a9b5]">
              {userData.role_name || "Member"}
            </small>
          </span>
          <ChevronDown size={15} className="text-[#8c96a3]" />
        </Link>

        <nav className="flex flex-col gap-[2px] max-[760px]:grid max-[760px]:grid-cols-4 max-[760px]:gap-[4px] max-[760px]:h-full">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);

            const count = label === "My tasks" ? openTaskCount : null;

            return (
              <Link
                key={label}
                href={href}
                className={`
                  flex min-h-[38px] w-full cursor-pointer items-center gap-3 rounded-[7px] px-3 text-left text-[12px] font-bold
                  max-[760px]:relative max-[760px]:min-h-[52px] max-[760px]:flex-col max-[760px]:justify-center
                  max-[760px]:gap-1 max-[760px]:px-[2px] max-[760px]:py-1 max-[760px]:text-center max-[760px]:text-[10px]
                  ${isActive ? "bg-[#edf1ff] text-[#284bce]" : "bg-transparent text-[#778293]"}
                `}
              >
                <Icon size={17} />
                {label}
                {count !== null && count > 0 && (
                  <span className="ml-auto rounded-[10px] bg-[#d9e0ff] px-[7px] py-[2px] text-[10px] text-[#284bce] max-[760px]:absolute max-[760px]:-mt-7 max-[760px]:ml-7 max-[760px]:px-[5px] max-[760px]:py-px">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto max-[760px]:hidden">
          {canViewSettings && (
            <Link
              href="/settings"
              className={`flex min-h-[38px] w-full items-center gap-3 rounded-[7px] px-3 text-left text-[12px] font-bold ${
                pathname.startsWith("/settings") ? "bg-[#edf1ff] text-[#284bce]" : "text-[#778293]"
              }`}
            >
              <Settings size={17} /> Settings
            </Link>
          )}
          <button
            onClick={handleManualSignOut}
            className="flex min-h-[38px] w-full cursor-pointer items-center gap-3 rounded-[7px] px-3 text-left text-[12px] font-bold text-[#778293]"
          >
            <LogIn size={17} /> Sign out
          </button>

          <div className="mt-5 flex flex-col gap-[7px] border-t border-[#e5e8ed] p-[20px_12px_0] text-[10px] text-[#a0a9b5]">
            <span>Need a hand?</span>
            <b className="text-[11px] text-[#536174]">
              Visit help center <span>↗</span>
            </b>
          </div>
        </div>
      </aside>
    </>
  );
}