import ProjectList from "./ProjectList";
import WorkspaceNav from "./WorkspaceNav";
import type { Project } from "../../types";

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
}

export default function Sidebar({ projects, activeProjectId }: SidebarProps) {
  return (
    <nav className="flex h-full flex-col overflow-hidden border-r border-neutral-200 bg-neutral-100/60 px-3 py-4 dark:border-neutral-800 dark:bg-neutral-900/40">
      <p className="px-2 pb-5 text-sm font-medium text-neutral-900 dark:text-neutral-100">
        OpenSecAI
      </p>

      <p className="shrink-0 px-2 pb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
        Projects
      </p>
      <ProjectList projects={projects} activeProjectId={activeProjectId} />

      {activeProjectId ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="shrink-0 px-2 pb-2 pt-5 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
            Workspace
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <WorkspaceNav projectId={activeProjectId} />
          </div>
        </div>
      ) : null}
    </nav>
  );
}