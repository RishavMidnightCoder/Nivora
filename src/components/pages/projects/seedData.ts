import { Project, ProjectMember } from "./types";

export const projectsSeed: Project[] = [
  { id: 1, name: "Nova Mobile", description: "Product & engineering", color: "nova", progress: 68, tasks: 18, due: "Sep 30", memberIds: [1, 2, 3] },
  { id: 2, name: "Website refresh", description: "Brand & marketing", color: "web", progress: 42, tasks: 11, due: "Oct 12", memberIds: [3, 4] },
  { id: 3, name: "Operations", description: "Internal systems", color: "green", progress: 84, tasks: 24, due: "Sep 22", memberIds: [1, 4, 5] },
];

export const membersSeed: ProjectMember[] = [
  { id: 1, name: "Maya Chen", email: "maya@nivora.dev", role: "Product designer", status: "Active", initials: "MC", tone: "blue" },
  { id: 2, name: "Jordan Lee", email: "jordan@nivora.dev", role: "Frontend engineer", status: "Active", initials: "JL", tone: "orange" },
  { id: 3, name: "Sam Rivera", email: "sam@nivora.dev", role: "Product manager", status: "Active", initials: "SR", tone: "purple" },
  { id: 4, name: "Avery Stone", email: "avery@nivora.dev", role: "QA engineer", status: "Active", initials: "AS", tone: "green" },
  { id: 5, name: "Taylor Kim", email: "taylor@nivora.dev", role: "Developer", status: "Pending", initials: "TK", tone: "neutral" },
];