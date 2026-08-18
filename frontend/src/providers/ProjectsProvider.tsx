import { useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ProjectContext } from "../context/ProjectContext";
import { http } from "../api/http";
import { useAuth } from "./AuthProvider";
import type { Project } from "../types";

export function ProjectsProvider({ children }: { children: ReactNode }) {
    const { isAuth } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        try {
            const response = await http.get("/projects").json<{ projects: Project[] }>();
            setProjects(response.projects ?? []);
        } catch (error) {
            console.error(error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const updateProject = async (
        id: string,
        data: Partial<Pick<Project, "name" | "files" | "notes">>
    ): Promise<Project> => {
        const response = await http
            .put(`/projects/${id}`, { json: data })
            .json<{ project: Project }>();
        setProjects((prev) =>
            prev.map((project) => (project.id === id ? response.project : project))
        );
        return response.project;
    };

    useEffect(() => {
        if (!isAuth) {
            setProjects([]);
            setLoading(false);
            return;
        }
        void refresh();
    }, [isAuth]);

    const value = useMemo(
        () => ({ projects, loading, refresh, updateProject }),
        [projects, loading]
    );

    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProjects must be used within a ProjectsProvider");
    }
    return context;
}