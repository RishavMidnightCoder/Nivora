import { useSelector } from "react-redux";
import { hasPermission, hasAnyOf, hasAllOf } from "@/store/slices/accessSlice";

/** usePermission("create_tasks") -> boolean */
export function usePermission(key: string): boolean {
  return useSelector(hasPermission(key));
}

/** usePermissions(["view_tasks", "view_projects"], "any" | "all") -> boolean */
export function usePermissions(keys: string[], mode: "any" | "all" = "all"): boolean {
  const selector = mode === "any" ? hasAnyOf(keys) : hasAllOf(keys);
  return useSelector(selector);
}