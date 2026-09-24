"use client";

import { useState, ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full right-0 z-10 mb-2 w-max max-w-[240px] rounded-[7px] bg-[#172238] px-3 py-2 text-[10px] font-medium leading-relaxed text-white shadow-[0_8px_20px_#17223840]">
          {content}
        </div>
      )}
    </span>
  );
}