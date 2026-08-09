import PageHeader from "../components/workspace/PageHeader";
import AIAnnotation from "../components/workspace/AIAnnotation";
import ChatInput from "../components/workspace/ChatInput";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";
import { requestContent, annotationText, mockContext } from "../data/mock";

/**
 * Request inspector detail — the one workspace view that still shows the
 * right-hand Signals panel. Dummy data for now; rows in HTTP history will
 * eventually open this view with the matching request.
 */
export default function RequestInspectorPage() {
  const { project } = useWorkspaceContext();

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader title={project?.name ?? "Project"} context={mockContext} />

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
        <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300">
            {requestContent}
          </pre>
        </section>

        <AIAnnotation content={annotationText} />
      </div>

      <div className="shrink-0 px-6 pb-5">
        <ChatInput placeholder="Ask about this request" onSend={() => undefined} />
      </div>
    </div>
  );
}