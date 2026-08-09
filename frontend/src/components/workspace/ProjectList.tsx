import { NavLink } from "react-router-dom";
import { sidebarRowClass } from "./sidebarStyles";
import type { Project } from "../../types";

interface ProjectListProps {
  projects: Project[];
  activeProjectId: string | null;
}

export default function ProjectList({ projects, activeProjectId }: ProjectListProps) {
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
    </ul>
  );
}