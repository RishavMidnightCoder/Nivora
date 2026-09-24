import DashboardShell from "@/components/common/DashboardShell";
import Projects from "@/components/pages/projects/Projects";
import Tasks from "@/components/pages/tasks/Tasks";

export default function ProjectsPage() {
  return (
      <DashboardShell>
        <Tasks />
      </DashboardShell>
    );
}