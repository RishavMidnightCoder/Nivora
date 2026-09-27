"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-[34px] w-[34px] flex-shrink-0 cursor-pointer place-items-center rounded-[7px] border border-[#e5e8ed] text-[#7b8797] hover:bg-[#f6f7f9] dark:border-[#2c3542] dark:text-[#a0a9b5] dark:hover:bg-[#1c232e]"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}