import ProjectList from "./ProjectList";
import WorkspaceNav from "./WorkspaceNav";
import type { Project } from "../../types";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  loggedInUserId?: string | null;
}
export default function Sidebar({ projects, activeProjectId }: SidebarProps) {
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const displayName = user?.displayName || user?.username || "Unknown User";
  const initial = (user?.displayName || user?.username || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/login");
  };
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
      {isAuth ? (
        <div ref={menuRef} className="relative mt-auto">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="group flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 text-left transition-colors hover:border-neutral-200 hover:bg-white dark:hover:border-neutral-700 dark:hover:bg-neutral-800/60"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white dark:bg-neutral-700 dark:text-neutral-100">
              {initial}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
                {displayName}
              </span>
              <span className="block truncate text-[11px] text-neutral-400 dark:text-neutral-500">
                {user?.username ? `@${user.username}` : "Signed in"}
              </span>
            </span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg shadow-neutral-900/5 dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-black/20"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/");
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700/60"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4 text-neutral-400">
                  <path
                    fillRule="evenodd"
                    d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.62 7.433a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.993 6.993 0 0 1 7.51 3.456l.33-1.652Z"
                    clipRule="evenodd"
                  />
                  <path d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
                Settings
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                  <path
                    fillRule="evenodd"
                    d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M19 10a.75.75 0 0 0-.75-.75H8.712l1.961-1.96a.75.75 0 1 0-1.06-1.061l-3.25 3.25a.75.75 0 0 0 0 1.061l3.25 3.25a.75.75 0 0 0 1.06-1.06l-1.96-1.961h9.537A.75.75 0 0 0 19 10Z"
                    clipRule="evenodd"
                  />
                </svg>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-auto flex items-center justify-center">
           <button
      type="button"
      className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
      onClick={() => {
        console.log("Navigating to login page");
        navigate("/login");
      }}
    >
      Login
    </button>
    </div>
      )}
    </nav>
  );
}