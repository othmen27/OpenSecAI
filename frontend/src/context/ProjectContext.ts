import { createContext } from "react";
import type { Project } from "../types";

interface ProjectContextType {
    projects: Project[];
    loading: boolean;
    refresh: () => Promise<void>;
    updateProject: (
        id: string,
        data: Partial<Pick<Project, "name" | "files" | "notes">>
    ) => Promise<Project>;
}

export const ProjectContext = createContext<ProjectContextType | null>(null);