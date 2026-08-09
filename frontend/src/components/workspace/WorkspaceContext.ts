import { useOutletContext } from "react-router-dom";
import type { Project } from "../../types";

/** Context provided by `WorkspaceLayout` to routed workspace pages. */
export interface WorkspaceOutletContext {
  project: Project | null;
}

export function useWorkspaceContext(): WorkspaceOutletContext {
  return useOutletContext<WorkspaceOutletContext>();
}