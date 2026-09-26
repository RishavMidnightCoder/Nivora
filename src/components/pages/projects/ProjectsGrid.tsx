import { ProjectOut } from "@/services/api";
import ProjectCard from "./ProjectCard";
import type { ProjectStats } from "./Projects";

interface ProjectsGridProps {
  projects: ProjectOut[];
  stats: Record<number, ProjectStats>;
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
  /** delete_projects permission */
  canDelete: boolean;
}

export default function ProjectsGrid({ projects, stats, onOpen, onDelete, canDelete }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-[14px] max-[1000px]:grid-cols-2 max-[700px]:grid-cols-1 p-[20px_22px_24px]">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          stats={stats[project.id] ?? { taskCount: 0, progress: 0 }}
          onOpen={onOpen}
          onDelete={onDelete}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}