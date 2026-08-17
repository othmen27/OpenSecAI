import PageHeader from "../components/workspace/PageHeader";
import BinaryAnalysisRail from "./BinaryAnalysisRail";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";

/** Quiet empty state for now — upload flow comes with real logic later. */
export default function BinaryAnalysisPage() {
  const { project } = useWorkspaceContext();

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PageHeader title={project?.name ?? "Project"} context="Binary analysis" />

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6">
          <p className="text-[13px] text-neutral-400 dark:text-neutral-500">
            No binaries analyzed yet
          </p>
          <button
            type="button"
            className="cursor-pointer rounded-md border border-neutral-300 px-3 py-1.5 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-200/40 hover:text-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-200"
          >
            Upload binary
          </button>
        </div>
      </div>
      <BinaryAnalysisRail binary={null} />
    </div>
  );
}