import { IconFileText } from "@tabler/icons-react";
import PageHeader from "../components/workspace/PageHeader";
import ReportsRail, { type ReportFormat } from "./ReportsRail";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";

export default function ReportsPage() {
  const { project } = useWorkspaceContext();
  const files = project?.files ?? [];

  /** Stub generation handler — real export logic comes later. */
  const handleGenerate = (_format: ReportFormat) => {
    // TODO: kick off report generation in the gateway.
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PageHeader title={project?.name ?? "Project"} context="Reports" />

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {files.length > 0 ? (
            <ul className="space-y-0.5">
              {files.map((file, index) => (
                <li key={`${file}-${index}`}>
                  <div className="flex items-center gap-4 rounded-md px-3 py-2.5 text-[13px]">
                    <IconFileText
                      size={15}
                      stroke={1.75}
                      aria-hidden="true"
                      className="shrink-0 text-neutral-400 dark:text-neutral-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-neutral-700 dark:text-neutral-300">{file}</p>
                    </div>
                    <span className="shrink-0 text-[12px] text-neutral-400 dark:text-neutral-500">
                      source file
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-neutral-400 dark:text-neutral-500">
              No source files in this project yet.
            </p>
          )}
        </div>
      </div>
      <ReportsRail onGenerate={handleGenerate} />
    </div>
  );
}