"use client";

import { useState } from "react";
import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen max-[760px]:block bg-[#f7f8fa] max-[760px]:pb-[76px]">
      <Sidebar profileMenuOpen={profileMenuOpen} onCloseProfileMenu={() => setProfileMenuOpen(false)} />
      <section className="min-w-0 flex-1">
        <Topbar onMenuClick={() => setProfileMenuOpen(true)} />
        {children}
      </section>
    </div>
  );
}