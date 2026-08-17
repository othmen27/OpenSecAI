import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/workspace/PageHeader";
import HttpHistoryRail from "./HttpHistoryRail";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";

interface CapturedRequest {
  id: string;
  method: "GET" | "POST";
  path: string;
  timestamp: string;
  status: number;
  tags: string[];
}

const mockRequests: CapturedRequest[] = [
  { id: "req-1", method: "GET", path: "/v1/auth/session", timestamp: "2 min ago", status: 200, tags: ["auth"] },
  { id: "req-2", method: "POST", path: "/v1/auth/login", timestamp: "11 min ago", status: 200, tags: ["auth", "admin"] },
  { id: "req-3", method: "GET", path: "/v1/users/me", timestamp: "3 h ago", status: 200, tags: ["api"] },
  { id: "req-4", method: "POST", path: "/v1/payments/charge", timestamp: "5 h ago", status: 401, tags: ["api"] },
  { id: "req-5", method: "GET", path: "/v1/reports/q3-summary", timestamp: "1 d ago", status: 403, tags: ["admin"] },
  { id: "req-6", method: "GET", path: "/v1/admin/audit-log", timestamp: "2 d ago", status: 302, tags: ["admin", "api"] },
];

/** Tag names used by the request list — shown in the rail's filter section. */
const httpHistoryTags = Array.from(new Set(mockRequests.flatMap((request) => request.tags)));

export default function HttpHistoryPage() {
  const { project } = useWorkspaceContext();
  const [previewRequest, setPreviewRequest] = useState<CapturedRequest | null>(null);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PageHeader title={project?.name ?? "Project"} context="HTTP history" />

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <ul className="space-y-0.5">
            {mockRequests.map((request) => (
              <li key={request.id}>
                <Link
                  to={request.id}
                  onMouseEnter={() => setPreviewRequest(request)}
                  onFocus={() => setPreviewRequest(request)}
                  className="flex cursor-pointer items-center gap-4 rounded-md px-3 py-2 text-[13px] transition-colors hover:bg-neutral-200/40 dark:hover:bg-neutral-800/50"
                >
                  <span className="w-10 shrink-0 font-mono text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
                    {request.method}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-neutral-700 dark:text-neutral-300">
                    {request.path}
                  </span>
                  <span className="shrink-0 font-mono text-[12px] text-neutral-400 dark:text-neutral-500">
                    {request.status}
                  </span>
                  <span className="shrink-0 text-[12px] text-neutral-400 dark:text-neutral-500">
                    {request.timestamp}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <HttpHistoryRail tags={httpHistoryTags} preview={previewRequest} />
    </div>
  );
}