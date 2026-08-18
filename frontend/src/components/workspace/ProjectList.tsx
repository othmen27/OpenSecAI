import { NavLink } from "react-router-dom";
import { sidebarRowClass } from "./sidebarStyles";
import type { Project } from "../../types";

interface ProjectListProps {
  projects: Project[];
  activeProjectId: string | null;
  loading?: boolean;
}

export default function ProjectList({ projects, activeProjectId, loading }: ProjectListProps) {
  return (
    <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
      {projects.map((project) => (
        <li key={project.id}>
          <NavLink
            to={`/projects/${project.id}`}
            className={({ isActive }) =>
              sidebarRowClass(isActive || project.id === activeProjectId)
            }
          >
            <span className="truncate">{project.name}</span>
          </NavLink>
        </li>
      ))}

      {projects.length === 0 && loading ? (
        <li className="px-2 py-1 text-[12px] text-neutral-400 dark:text-neutral-500">
          Loading projects…
        </li>
      ) : null}

      {projects.length === 0 && !loading ? (
        <li className="px-2 py-1 text-[12px] text-neutral-400 dark:text-neutral-500">
          No projects yet
        </li>
      ) : null}
    </ul>
  );
}