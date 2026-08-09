import { IconDownload } from "@tabler/icons-react";
import PageHeader from "../components/workspace/PageHeader";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";

interface Report {
  id: string;
  title: string;
  date: string;
  format: "PDF" | "Markdown";
}

const mockReports: Report[] = [
  { id: "report-1", title: "acme.com recon sweep", date: "Aug 2, 2026", format: "PDF" },
  { id: "report-2", title: "acme.com auth flow review", date: "Jul 29, 2026", format: "Markdown" },
];

export default function ReportsPage() {
  const { project } = useWorkspaceContext();

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader title={project?.name ?? "Project"} context="Reports" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <ul className="space-y-0.5">
          {mockReports.map((report) => (
            <li key={report.id}>
              <div className="flex items-center gap-4 rounded-md px-3 py-2.5 text-[13px]">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-neutral-700 dark:text-neutral-300">{report.title}</p>
                  <p className="text-[12px] text-neutral-400 dark:text-neutral-500">
                    {report.date}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-neutral-400 dark:text-neutral-500">
                  {report.format}
                </span>
                <button
                  type="button"
                  aria-label={`Download ${report.title}`}
                  className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200/50 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-300"
                >
                  <IconDownload size={15} stroke={1.75} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}