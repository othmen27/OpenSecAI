import ProjectsOverviewRail from "./ProjectsOverviewRail";

/**
 * Landing state for `/` — no project selected yet, so the workspace section
 * stays hidden and the center panel invites a selection.
 */
export default function SelectProjectPage() {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <div className="flex h-full min-h-0 flex-1 items-center justify-center px-6">
        <p className="text-[13px] text-neutral-400 dark:text-neutral-500">
          Select a project to open its workspace.
        </p>
      </div>
      <ProjectsOverviewRail />
    </div>
  );
}