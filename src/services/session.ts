// src/services/session.ts
import { authApi } from "./api";
import { toast } from "sonner";

let isLoggingOut = false;

export async function signOut(showToast = true) {
  if (isLoggingOut) return;
  isLoggingOut = true;

  if (showToast) {
    toast.error("Your session has expired. Please log in again.");
  }

  try {
    await authApi.logout();
  } catch {
    // even if this fails, still redirect — the cookie may already be gone
  } finally {
    window.location.href = "/login";
  }
}