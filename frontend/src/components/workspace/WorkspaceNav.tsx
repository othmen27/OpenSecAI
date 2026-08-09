import { NavLink } from "react-router-dom";
import { sidebarRowClass } from "./sidebarStyles";
import { workspaceNavItems } from "./workspaceNavItems";

interface WorkspaceNavProps {
  projectId: string;
}

export default function WorkspaceNav({ projectId }: WorkspaceNavProps) {
  return (
    <ul className="space-y-0.5">
      {workspaceNavItems.map((item) => (
        <li key={item.path}>
          <NavLink
            to={`/projects/${projectId}${item.path}`}
            className={({ isActive }) => sidebarRowClass(isActive)}
          >
            <item.Icon size={15} stroke={1.75} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}