import { Navigate, Outlet, useMatch, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import SignalsPanel from "./SignalsPanel";
import { mockProjects, mockSignals } from "../../data/mock";
import type { WorkspaceOutletContext } from "./WorkspaceContext";

/**
 * Shared shell for both the project-select landing page and the workspace
 * layout under `/projects/:projectId`. Renders the sidebar, an `<Outlet />`
 * for the routed workspace page, and — only on the request inspector route —
 * the right-hand Signals panel.
 */
export default function WorkspaceLayout() {
  const routeParams = useParams();
  const projectId = routeParams.projectId ?? null;

  const activeProject =
    projectId === null
      ? null
      : mockProjects.find((project) => project.id === projectId) ?? null;

  // Signals are reserved for the HTTP history detail / request inspector view.
  const inspectorMatch = useMatch("/projects/:projectId/http-history/:requestId");
  const showSignals = inspectorMatch !== null;

  // Unknown project id — fall back to the project select screen.
  if (projectId !== null && activeProject === null) {
    return <Navigate to="/" replace />;
  }

  const outletContext: WorkspaceOutletContext = { project: activeProject };

  return (
    <div
      className={`grid h-screen overflow-hidden bg-neutral-50 text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 ${
        showSignals
          ? "grid-cols-[220px_minmax(0,1fr)_260px]"
          : "grid-cols-[220px_minmax(0,1fr)]"
      }`}
    >
      <Sidebar projects={mockProjects} activeProjectId={activeProject?.id ?? null} />
      <main className="flex h-full min-w-0 flex-col overflow-hidden">
        <Outlet context={outletContext} />
      </main>
      {showSignals ? <SignalsPanel signals={mockSignals} /> : null}
    </div>
  );
}