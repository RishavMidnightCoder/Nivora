"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  UserPlus,
  CircleAlert,
  Check,
  Users,
} from "lucide-react";
import ThemeToggle from "@/components/elements/ThemeToggle";
import { notificationApi, NotificationOut } from "@/services/api";
import { useSelector } from "react-redux";
import { selectUserData } from "@/store/slices/userSlice";

const typeMeta: Record<string, { icon: typeof UserPlus; tone: string }> = {
  task_assigned: { icon: UserPlus, tone: "bg-[#eaf0ff] text-[#536fd8]" },
  task_completed: { icon: Check, tone: "bg-[#e6f7ef] text-[#43a77c]" },
  task_critical: { icon: CircleAlert, tone: "bg-[#fdebed] text-[#d76a71]" },
  member_invited: { icon: Users, tone: "bg-[#f1eafa] text-[#9574ca]" },
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationOut[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  const userData = useSelector(selectUserData);
  const displayName = userData.user_name || userData.user_email || "";
  const initials = displayName
    ? displayName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationApi.list();
      setNotifications(data);
    } catch {
      // topbar preview is non-critical — fail silently, no toast needed
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications, pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  async function handlePreviewClick(notification: NotificationOut) {
    if (notification.is_read) return;
    try {
      await notificationApi.markRead(notification.id);
      setNotifications((current) =>
        current.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)),
      );
    } catch {
      // non-critical — the full Notifications page is the source of truth
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const preview = notifications.slice(0, 3);

  const breadcrumbLabel =
    pathname.startsWith("/tasks") ? "My tasks" :
    pathname.startsWith("/projects") ? "Projects" :
    pathname.startsWith("/team") ? "Team" :
    pathname.startsWith("/profile") ? "Profile" :
    pathname.startsWith("/settings") ? "Settings" :
    pathname.startsWith("/notifications") ? "Notifications" :
    "Overview";

  return (
    <header className="relative flex h-[72px] max-[760px]:h-[60px] items-center justify-between border-b border-[#e5e8ed] bg-white px-[38px] max-[1100px]:px-[24px] max-[760px]:px-[14px] max-[760px]:sticky max-[760px]:top-0 max-[760px]:z-10">
      <div className="flex items-center gap-[11px]">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="hidden cursor-pointer text-[#627084] max-[760px]:block"
        >
          <Menu size={19} />
        </button>
        <div className="flex items-center gap-[11px] text-[12px] text-[#9ba4b0]">
          <span className="max-[760px]:hidden">Workspace</span>
          <b className="max-[760px]:hidden font-normal text-[#c2c8d0]">/</b>
          <strong className="font-normal text-[#3b4758]">{breadcrumbLabel}</strong>
        </div>
      </div>

      <div className="flex items-center gap-[18px] max-[760px]:gap-[10px]">
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setShowNotifications((current) => !current)}
            aria-label="Notifications"
            aria-expanded={showNotifications}
            className="relative grid cursor-pointer place-items-center text-[#7b8797]"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <i className="absolute right-0 top-0 h-[6px] w-[6px] rounded-full border border-white bg-[#ef6e6e]" />
            )}
          </button>

          {showNotifications && (
            <div
              ref={popoverRef}
              className="absolute right-0 top-[38px] z-20 w-[300px] rounded-[9px] border border-[#e5e8ed] bg-white p-[7px] shadow-[0_15px_40px_#17223818]"
            >
              <div className="flex items-center justify-between px-[10px] py-[10px]">
                <b className="text-[12px] text-[#172238]">Notifications</b>
                <button
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close notifications"
                  className="cursor-pointer text-[#8c97a4]"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex flex-col">
                {preview.length === 0 ? (
                  <p className="px-[10px] py-[20px] text-center text-[11px] text-[#9ba4b0]">
                    No notifications yet.
                  </p>
                ) : (
                  preview.map((item) => {
                    const meta = typeMeta[item.type] ?? { icon: Bell, tone: "bg-[#f2f4f7] text-[#526075]" };
                    const Icon = meta.icon;

                    return (
                      <Link
                        key={item.id}
                        href="/notifications"
                        onClick={() => {
                          setShowNotifications(false);
                          handlePreviewClick(item);
                        }}
                        className="flex items-center gap-[10px] rounded-[6px] p-[10px] hover:bg-[#f6f7f9]"
                      >
                        <span className={`grid h-[25px] w-[25px] flex-shrink-0 place-items-center rounded-[6px] ${meta.tone}`}>
                          <Icon size={15} />
                        </span>
                        <span className="flex flex-col gap-[4px]">
                          <b className={`text-[10px] ${item.is_read ? "font-medium text-[#536174]" : "text-[#172238]"}`}>
                            {item.title}
                          </b>
                          <small className="text-[9px] text-[#9aa3af]">{formatRelativeTime(item.created_at)}</small>
                        </span>
                        {!item.is_read && (
                          <i className="ml-auto h-[6px] w-[6px] flex-shrink-0 rounded-full bg-[#284bce]" />
                        )}
                      </Link>
                    );
                  })
                )}
              </div>

              <Link
                href="/notifications"
                onClick={() => setShowNotifications(false)}
                className="flex items-center justify-center gap-[9px] rounded-[6px] py-[12px] text-[11px] font-extrabold text-[#284bce] hover:bg-[#f6f7f9]"
              >
                View all notifications <span>→</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/profile"
          aria-label="Open profile"
          className="grid h-[25px] w-[25px] place-items-center rounded-full border-2 border-white bg-[#dc9a67] text-[8px] font-extrabold text-white max-[420px]:hidden"
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}