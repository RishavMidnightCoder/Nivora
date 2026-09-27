"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  UserPlus,
  CircleAlert,
  Check,
} from "lucide-react";
import ThemeToggle from "@/components/elements/ThemeToggle";

interface NotificationPreview {
  id: number;
  icon: typeof UserPlus;
  title: string;
  time: string;
  tone: "blue" | "red" | "green";
}

const notificationsSeed: NotificationPreview[] = [
  { id: 1, icon: UserPlus, title: "You were assigned to NOVA-142", time: "12 min ago", tone: "blue" },
  { id: 2, icon: CircleAlert, title: "NOVA-138 is now critical", time: "1 hour ago", tone: "red" },
  { id: 3, icon: Check, title: "Jordan completed WEB-094", time: "3 hours ago", tone: "green" },
];

const toneStyles: Record<string, string> = {
  blue: "bg-[#eaf0ff] text-[#536fd8]",
  red: "bg-[#fdebed] text-[#d76a71]",
  green: "bg-[#e6f7ef] text-[#43a77c]",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

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
            <i className="absolute right-0 top-0 h-[6px] w-[6px] rounded-full border border-white bg-[#ef6e6e]" />
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
                {notificationsSeed.map((item) => (
                  <Link
                    key={item.id}
                    href="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="flex items-center gap-[10px] rounded-[6px] p-[10px] hover:bg-[#f6f7f9]"
                  >
                    <span className={`grid h-[25px] w-[25px] flex-shrink-0 place-items-center rounded-[6px] ${toneStyles[item.tone]}`}>
                      <item.icon size={15} />
                    </span>
                    <span className="flex flex-col gap-[4px]">
                      <b className="text-[10px] text-[#172238]">{item.title}</b>
                      <small className="text-[9px] text-[#9aa3af]">{item.time}</small>
                    </span>
                  </Link>
                ))}
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
          AM
        </Link>
      </div>
    </header>
  );
}