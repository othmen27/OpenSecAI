import { useState } from "react";
import PageHeader from "../components/workspace/PageHeader";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";

const mockNoteTitle = "acme.com — auth flow findings";

const mockNoteBody = `Cookie flags
- session_id is set without HttpOnly or Secure on /v1/auth/login.
- Fix: explicit cookie prefix, SameSite=Strict.

Internal report endpoint
- POST /api/v2/internal/report is reachable from the public bundle.
- Confirm whether it sits behind an admin allowlist.

Next scan
- Re-run subdomain enumeration and diff against the last run.`;

export default function NotesPage() {
  const { project } = useWorkspaceContext();
  const [title, setTitle] = useState(mockNoteTitle);
  const [body, setBody] = useState(mockNoteBody);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader title={project?.name ?? "Project"} context="Notes" />

      <div className="flex min-h-0 flex-1 flex-col px-6 py-6">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Note title"
          className="w-full bg-transparent text-lg font-medium text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write your notes here…"
          className="min-h-0 flex-1 resize-none bg-transparent pt-5 text-[13px] leading-relaxed text-neutral-600 outline-none placeholder:text-neutral-400 dark:text-neutral-400 dark:placeholder:text-neutral-500"
        />
      </div>
    </div>
  );
}