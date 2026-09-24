export const AVAILABLE_PERMISSIONS = [
  { key: "view_dashboard", label: "View dashboard", description: "See workspace overview and stats" },
  { key: "manage_tasks", label: "Manage tasks", description: "Create, edit, and delete tasks" },
  { key: "manage_projects", label: "Manage projects", description: "Create, edit, and delete projects" },
  { key: "manage_members", label: "Manage members", description: "Invite, update, and remove team members" },
  { key: "manage_roles", label: "Manage roles", description: "Create, edit, and delete roles" },
] as const;

export type PermissionKey = (typeof AVAILABLE_PERMISSIONS)[number]["key"];