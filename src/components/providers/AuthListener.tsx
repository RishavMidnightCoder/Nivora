// src/components/providers/AuthListener.tsx
"use client";

import { useEffect } from "react";
import { signOut } from "@/services/session";

export default function AuthListener() {
  useEffect(() => {
    function handleLogout() {
      signOut();
    }
    window.addEventListener("app:logout", handleLogout);
    return () => window.removeEventListener("app:logout", handleLogout);
  }, []);

  return null;
}