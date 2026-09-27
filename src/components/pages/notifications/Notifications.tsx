"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, CircleAlert, Check, UserPlus } from "lucide-react";
import { notificationApi, NotificationOut } from "@/services/api";

const typeMeta: Record<string, { icon: typeof UserPlus; tone: string; category: "Tasks" | "Team" }> = {
  task_assigned: { icon: UserPlus, tone: "bg-[#eaf0ff] text-[#536fd8]", category: "Tasks" },
  task_completed: { icon: Check, tone: "bg-[#e6f7ef] text-[#43a77c]", category: "Tasks" },
  task_critical: { icon: CircleAlert, tone: "bg-[#fdebed] text-[#d76a71]", category: "Tasks" },
  member_invited: { icon: Users, tone: "bg-[#f1eafa] text-[#9574ca]", category: "Team" },
};

const filters = ["All", "Tasks", "Team"] as const;
type Filter = (typeof filters)[number];

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

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("All");
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationApi.list();
      setNotifications(data);
    } catch {
      // toasted by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  async function handleMarkAllRead() {
    setMarkingAll(true);
    try {
      await notificationApi.markAllRead();
      setNotifications((current) => current.map((n) => ({ ...n, is_read: true })));
    } catch {
      // toasted by interceptor
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleItemClick(notification: NotificationOut) {
    if (notification.is_read) return;
    try {
      await notificationApi.markRead(notification.id);
      setNotifications((current) =>
        current.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)),
      );
    } catch {
      // toasted by interceptor
    }
  }

  const visibleNotifications = notifications.filter((n) => {
    if (filter === "All") return true;
    return typeMeta[n.type]?.category === filter;
  });

  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[26px]">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
          Activity center
        </p>
        <h1 className="m-0 font-display text-[42px] max-[760px]:text-[30px] font-medium tracking-[-0.05em] text-[#172238]">
          Notifications
        </h1>
        <p className="mt-2 text-[13px] text-[#778293]">
          Review the latest activity from your workspace.
        </p>
      </div>

      <section className="rounded-[9px] border border-[#e5e8ed] bg-white">
        <div className="flex items-start justify-between p-[21px_21px_18px] max-[760px]:flex-col max-[760px]:gap-[12px]">
          <div>
            <h2 className="m-0 mb-[5px] text-[14px] tracking-[-0.02em] text-[#172238]">Notifications</h2>
            <p className="m-0 text-[11px] text-[#8d97a4]">Stay up to date with activity across your workspace.</p>
          </div>
          {hasUnread && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="cursor-pointer whitespace-nowrap text-[11px] font-extrabold text-[#284bce] disabled:opacity-60"
            >
              {markingAll ? "Marking…" : "Mark all read"}
            </button>
          )}
        </div>

        <div className="flex gap-[5px] px-[21px] pb-[16px] max-[760px]:px-[14px]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-[6px] px-3 py-[8px] text-[12px] font-bold ${
                filter === f ? "bg-[#edf1ff] text-[#284bce]" : "text-[#778293]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="border-t border-[#e5e8ed]">
          {loading ? (
            <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">Loading…</div>
          ) : visibleNotifications.length === 0 ? (
            <div className="p-[40px] text-center text-[12px] text-[#9ba4b0]">
              No notifications yet.
            </div>
          ) : (
            visibleNotifications.map((item) => {
              const meta = typeMeta[item.type] ?? {
                icon: Users,
                tone: "bg-[#f2f4f7] text-[#526075]",
                category: "Team" as const,
              };
              const Icon = meta.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="flex w-full cursor-pointer items-center gap-[12px] border-b border-[#f1f2f4] px-[21px] py-[14px] text-left hover:bg-[#f8f9fb] max-[760px]:px-[14px]"
                >
                  <span className={`grid h-[32px] w-[32px] flex-shrink-0 place-items-center rounded-[8px] ${meta.tone}`}>
                    <Icon size={16} />
                  </span>
                  <span className="flex flex-1 flex-col gap-[2px]">
                    <b className={`text-[12px] ${item.is_read ? "font-medium text-[#536174]" : "font-bold text-[#172238]"}`}>
                      {item.title}
                    </b>
                    <small className="text-[10px] text-[#9ba4b0]">{formatRelativeTime(item.created_at)}</small>
                  </span>
                  {!item.is_read && <i className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-[#284bce]" />}
                </button>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}