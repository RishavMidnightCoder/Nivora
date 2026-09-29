// src/components/providers/AuthListener.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { signOut } from "@/services/session";
import { setUserData, clearUserData } from "@/store/slices/userSlice";
import { setRoleAccess, clearAccess } from "@/store/slices/accessSlice";
import type { AppDispatch } from "@/store";

// Must be "/backend" (same-origin proxy defined in next.config.ts).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// Routes where a visitor is expected to be logged out — skip the
// session check entirely instead of firing a request that will
// always 401.
const PUBLIC_ROUTES = ["/", "/login", "/signup"];

export default function AuthListener() {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();

  useEffect(() => {
    function handleLogout() {
      signOut();
    }
    window.addEventListener("app:logout", handleLogout);
    return () => window.removeEventListener("app:logout", handleLogout);
  }, []);

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) {
      // Make sure stale redux-persist state doesn't linger and grant
      // permissions that no longer apply.
      dispatch(clearUserData());
      dispatch(clearAccess());
      return;
    }

    let cancelled = false;

    async function hydrateSession() {
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          if (!cancelled) {
            dispatch(clearUserData());
            dispatch(clearAccess());
          }
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        dispatch(setUserData(data.user));
        dispatch(setRoleAccess(data.permissions));
      } catch {
        if (!cancelled) {
          dispatch(clearUserData());
          dispatch(clearAccess());
        }
      }
    }

    // Runs once per route change (this component lives at the root
    // layout), so every non-public page load re-syncs Redux from the DB.
    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [dispatch, pathname]);

  return null;
}