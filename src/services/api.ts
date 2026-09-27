import {
  getData,
  postData,
  patchData,
  deleteData,
  postFormData,
} from "./gateway";

// Auth

export interface EmailPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface SignupPayload {
  FullName: string;
  email: string;
  password: string;
}

export const authApi = {
  signup: (payload: SignupPayload) =>
    postData({ endpoint: "/users/signup", data: payload }),

  login: (payload: EmailPayload) =>
    postData({ endpoint: "/users/login", data: payload }),

  verifyOtp: (payload: VerifyOtpPayload) =>
    postData({ endpoint: "/users/verify-otp", data: payload }),

  resendOtp: (payload: EmailPayload) =>
    postData({ endpoint: "/users/resend-otp", data: payload }),

  logout: () => postData({ endpoint: "/users/logout", data: {} }),

   getSessionCount: (): Promise<{ count: number }> =>
    getData({ endpoint: "/users/sessions/count" }),

  revokeAllSessions: () =>
    postData({ endpoint: "/users/sessions/revoke-all", data: {} }),
};

// Members & Roles

export interface MemberOut {
  id: number;
  user_id: number;
  email: string;
  FullName: string | null;
  role_id: number;
  role_name: string;
  status: string;
  created_at: string;
}

export interface InviteMemberPayload {
  email: string;
  role_id: number;
}

export interface UpdateMemberPayload {
  role_id?: number;
}

export interface RoleOut {
  id: number;
  name: string;
  description: string | null;
  permissions: string[];
  member_count: number;
  created_at: string;
}

export interface RolePayload {
  name: string;
  description?: string;
  permissions: string[];
}

export const teamApi = {
  // Members
  listMembers: (): Promise<MemberOut[]> => getData({ endpoint: `/members/` }),

  getMember: (memberId: number) =>
    getData({ endpoint: `/members/${memberId}` }),

  updateMember: (memberId: number, payload: UpdateMemberPayload) =>
    patchData({ endpoint: `/members/${memberId}`, data: payload }),

  removeMember: (memberId: number) =>
    deleteData({ endpoint: `/members/${memberId}` }),

  inviteMember: (payload: InviteMemberPayload) =>
    postData({ endpoint: `/members/invite`, data: payload }),

  toggleStatus: (memberId: number) =>
    patchData({ endpoint: `/members/${memberId}/toggle-status`, data: {} }),

  acceptInvite: (
    token: string,
    payload: { FullName: string; password: string },
  ) =>
    postData({ endpoint: `/members/invites/${token}/accept`, data: payload }),

  cancelInvite: (memberId: number) =>
    patchData({ endpoint: `/members/${memberId}/cancel-invite`, data: {} }),

  // Roles
  listRoles: (): Promise<RoleOut[]> => getData({ endpoint: `/roles/` }),

  getRole: (roleId: number) => getData({ endpoint: `/roles/${roleId}` }),

  createRole: (payload: RolePayload) =>
    postData({ endpoint: `/roles/`, data: payload }),

  updateRole: (roleId: number, payload: RolePayload) =>
    patchData({ endpoint: `/roles/${roleId}`, data: payload }),

  deleteRole: (roleId: number) => deleteData({ endpoint: `/roles/${roleId}` }),
};

export interface ProjectOut {
  id: number;
  name: string;
  description: string | null;
  color: string;
  progress: number;
  tasks: number;
  due: string | null;
  member_ids: number[];
  created_at: string;
}

export interface ProjectPayload {
  name: string;
  description?: string;
  due?: string;
  color: string;
}

export interface ProjectMemberOut {
  id: number;
  member_id: number;
  email: string;
  FullName: string | null;
  role_name: string;
}

export const projectApi = {
  listProjects: (): Promise<ProjectOut[]> =>
    getData({ endpoint: `/projects/` }),

  getProject: (id: number): Promise<ProjectOut> =>
    getData({ endpoint: `/projects/${id}` }),

  createProject: (payload: ProjectPayload): Promise<ProjectOut> =>
    postData({ endpoint: `/projects/`, data: payload }),

  updateProject: (id: number, payload: ProjectPayload): Promise<ProjectOut> =>
    patchData({ endpoint: `/projects/${id}`, data: payload }),

  deleteProject: (id: number) => deleteData({ endpoint: `/projects/${id}` }),

  listProjectMembers: (id: number): Promise<ProjectMemberOut[]> =>
    getData({ endpoint: `/projects/${id}/members` }),

  addProjectMember: (id: number, memberId: number): Promise<ProjectOut> =>
    postData({
      endpoint: `/projects/${id}/members`,
      data: { member_id: memberId },
    }),

  removeProjectMember: (id: number, memberId: number): Promise<ProjectOut> =>
    deleteData({ endpoint: `/projects/${id}/members/${memberId}` }),
};

export interface TaskOut {
  id: number;
  code: string;
  title: string;
  description: string | null;
  project_id: number;
  project_name: string;
  status: string;
  priority: string;
  due: string | null;
  assignee_id: number | null;
  assignee_name: string | null;
  attachment_count: number;
  created_at: string;
}

export interface TaskPayload {
  title: string;
  description?: string;
  project_id: number;
  status: string;
  priority: string;
  due?: string;
  assignee_id?: number | null;
}

export interface TaskAttachmentOut {
  id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  file_type: "image" | "video";
  created_at: string;
}

export const taskApi = {
  listTasks: (): Promise<TaskOut[]> => getData({ endpoint: `/tasks/` }),

  getTask: (id: number): Promise<TaskOut> =>
    getData({ endpoint: `/tasks/${id}` }),

  createTask: (payload: TaskPayload): Promise<TaskOut> =>
    postData({ endpoint: `/tasks/`, data: payload }),

  updateTask: (id: number, payload: TaskPayload): Promise<TaskOut> =>
    patchData({ endpoint: `/tasks/${id}`, data: payload }),

  deleteTask: (id: number) => deleteData({ endpoint: `/tasks/${id}` }),

  uploadAttachment: (
    taskId: number,
    file: File,
  ): Promise<TaskAttachmentOut> => {
    const formData = new FormData();
    formData.append("file", file);
    return postFormData({
      endpoint: `/tasks/${taskId}/attachments`,
      data: formData,
    });
  },

  listAttachments: (taskId: number): Promise<TaskAttachmentOut[]> =>
    getData({ endpoint: `/tasks/${taskId}/attachments` }),

  deleteAttachment: (taskId: number, attachmentId: number) =>
    deleteData({ endpoint: `/tasks/${taskId}/attachments/${attachmentId}` }),
};


export interface WorkspaceOverview {
  workspace_name: string;
  owner_name: string | null;
  owner_email: string;
  created_at: string;
  member_count: number;
  role_count: number;
  project_count: number;
  task_count: number;
}

export const workspaceApi = {
  getOverview: (): Promise<WorkspaceOverview> => getData({ endpoint: "/workspace/overview" }),
  updateName: (workspace_name: string): Promise<WorkspaceOverview> =>
    patchData({ endpoint: "/workspace/name", data: { workspace_name } }),
  deleteWorkspace: (confirm_name: string) =>
    deleteData({ endpoint: "/workspace/", data: { confirm_name } }),
};


export interface NotificationOut {
  id: number;
  type: string;
  title: string;
  is_read: boolean;
  created_at: string;
}

export const notificationApi = {
  list: (): Promise<NotificationOut[]> => getData({ endpoint: "/notifications/" }),
  markRead: (id: number) => patchData({ endpoint: `/notifications/${id}/read`, data: {} }),
  markAllRead: () => postData({ endpoint: "/notifications/mark-all-read", data: {} }),
};
