import PageHeader from "../components/workspace/PageHeader";
import AIAnnotation from "../components/workspace/AIAnnotation";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";

interface JsFile {
  id: string;
  filename: string;
  size: string;
  endpointCount: number;
}

interface JsFinding {
  id: string;
  detail: string;
  note: string;
}

const mockJsFiles: JsFile[] = [
  { id: "js-1", filename: "bundle.main-8f3c2a.js", size: "412 kB", endpointCount: 24 },
  { id: "js-2", filename: "widgets/checkout-form.js", size: "86 kB", endpointCount: 9 },
  { id: "js-3", filename: "vendor/analytics.min.js", size: "203 kB", endpointCount: 3 },
];

/** One file shown expanded below the list. */
const expandedFile = mockJsFiles[0];

const mockFindings: JsFinding[] = [
  {
    id: "f-1",
    detail: "POST /api/v2/internal/report",
    note: "Internal-only route referenced from the public bundle verify the access control before launch.",
  },
  {
    id: "f-2",
    detail: "sk_live_51Mx9KD…eT4vK2",
    note: "Looks like a live Stripe key confirm it has been rotated or scoped down.",
  },
  {
    id: "f-3",
    detail: "/assets/json/config.9b21d4.json",
    note: "Config file baked into the bundle; check it for secrets not caught by pattern matching.",
  },
];

export default function JsAnalysisPage() {
  const { project } = useWorkspaceContext();

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader title={project?.name ?? "Project"} context="JS analysis" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <ul className="space-y-0.5">
          {mockJsFiles.map((file) => (
            <li key={file.id}>
              <div className="flex items-center gap-4 rounded-md px-3 py-2 text-[13px]">
                <span className="min-w-0 flex-1 truncate font-mono text-neutral-700 dark:text-neutral-300">
                  {file.filename}
                </span>
                <span className="shrink-0 text-[12px] text-neutral-400 dark:text-neutral-500">
                  {file.size} · {file.endpointCount} endpoints found
                </span>
              </div>
            </li>
          ))}
        </ul>

        <section className="mt-8">
          <p className="px-3 pb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
            Findings — {expandedFile.filename}
          </p>
          <div className="space-y-5 px-3">
            {mockFindings.map((finding) => (
              <div key={finding.id} className="space-y-1.5">
                <p className="font-mono text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {finding.detail}
                </p>
                <AIAnnotation content={finding.note} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}