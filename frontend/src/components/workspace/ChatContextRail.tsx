import { IconFile, IconHistory } from "@tabler/icons-react";

/**
 * Project-level severity rollup for the context rail.
 */
export interface SignalCounts {
  high: number;
  medium: number;
  info: number;
}

/**
 * One entry that has been referenced/loaded into the current conversation's
 * context — either a request (method + path) or a file (filename).
 */
export interface ReferencedItem {
  id: string;
  kind: "request" | "file";
  label: string;
}

interface ChatContextRailProps {
  /** Project signal severity rollup; `null` renders the quiet empty state. */
  signalCounts?: SignalCounts | null;
  /** Requests/files pulled into the current conversation's context. */
  referencedItems?: ReferencedItem[];
  /** Suggested fast-path prompts — clicking one fills the chat input. */
  suggestions?: string[];
  /** Called when a suggestion is clicked with that prompt text. */
  onApplyPrompt?: (prompt: string) => void;
}

const sectionLabelClass =
  "pb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500";

const emptyStateClass = "text-[12px] text-neutral-400 dark:text-neutral-500";

/** Mock rollup — wire to the real aggregate query later. */
const mockSignalCounts: SignalCounts = { high: 2, medium: 1, info: 1 };

/** Mock context entries for the current conversation. */
const mockReferencedItems: ReferencedItem[] = [
  { id: "ctx-1", kind: "request", label: "POST /v1/auth/login" },
  { id: "ctx-2", kind: "file", label: "src/middleware/session.ts" },
  { id: "ctx-3", kind: "request", label: "GET /v1/auth/session" },
];

/** Mock suggested prompts. */
const mockSuggestions = ["Generate a fix for the cookie flags", "Draft a finding for this"];

interface SignalStatProps {
  label: string;
  count: number;
  countClass: string;
}

/** One count + muted label in the severity rollup. */
function SignalStat({ label, count, countClass }: SignalStatProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className={`text-base font-medium leading-none ${countClass}`}>{count}</span>
      <span className="text-[11px] leading-none text-neutral-400 dark:text-neutral-500">{label}</span>
    </div>
  );
}

interface ProjectSignalsProps {
  counts: SignalCounts | null;
}

function ProjectSignals({ counts }: ProjectSignalsProps) {
  return (
    <section className="min-h-0">
      <p className={sectionLabelClass}>Project signals</p>
      {counts ? (
        <div className="flex gap-3">
          <SignalStat label="high" count={counts.high} countClass="text-red-500 dark:text-red-400" />
          <SignalStat label="medium" count={counts.medium} countClass="text-amber-500 dark:text-amber-400" />
          <SignalStat label="info" count={counts.info} countClass="text-neutral-400 dark:text-neutral-500" />
        </div>
      ) : (
        <p className={emptyStateClass}>No signals yet</p>
      )}
    </section>
  );
}

interface ContextPillProps {
  item: ReferencedItem;
}

/** Flat row for one referenced request or file in the conversation context. */
function ContextPill({ item }: ContextPillProps) {
  const Icon = item.kind === "request" ? IconHistory : IconFile;
  return (
    <li className="flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5 dark:bg-neutral-800">
      <Icon
        size={14}
        stroke={1.75}
        className="shrink-0 text-neutral-400 dark:text-neutral-500"
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-neutral-600 dark:text-neutral-400">
        {item.label}
      </span>
    </li>
  );
}

interface ReferencedSectionProps {
  items: ReferencedItem[];
}

function ReferencedSection({ items }: ReferencedSectionProps) {
  return (
    <section className="min-h-0">
      <p className={sectionLabelClass}>Referenced in this chat</p>
      {items.length > 0 ? (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <ContextPill key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <p className={emptyStateClass}>Nothing referenced yet</p>
      )}
    </section>
  );
}

interface SuggestedPromptProps {
  prompt: string;
  onApply: (prompt: string) => void;
}

/** Bordered fast-path row — looks like a link, not a primary action. */
function SuggestedPrompt({ prompt, onApply }: SuggestedPromptProps) {
  return (
    <button
      type="button"
      onClick={() => onApply(prompt)}
      className="w-full rounded-md border border-neutral-200 px-3 py-2 text-left text-[12px] text-accent-600 transition-colors hover:border-accent-300 hover:bg-accent-50 dark:border-neutral-700 dark:text-accent-300 dark:hover:border-accent-700 dark:hover:bg-accent-950"
    >
      {prompt}
    </button>
  );
}

interface SuggestedSectionProps {
  prompts: string[];
  onApplyPrompt?: (prompt: string) => void;
}

function SuggestedSection({ prompts, onApplyPrompt }: SuggestedSectionProps) {
  return (
    <section className="min-h-0">
      <p className={sectionLabelClass}>Suggested</p>
      {prompts.length > 0 ? (
        <div className="space-y-1.5">
          {prompts.map((prompt) => (
            <SuggestedPrompt key={prompt} prompt={prompt} onApply={(p) => onApplyPrompt?.(p)} />
          ))}
        </div>
      ) : (
        <p className={emptyStateClass}>Nothing suggested yet</p>
      )}
    </section>
  );
}

/**
 * Right-hand "Context rail" for the Chat view.
 *
 * Reads the conversation's ambient context: a compact project-signal rollup,
 * the requests/files referenced in the current chat, and suggested prompts
 * that fill (but do not send) the chat input.
 */
export default function ChatContextRail({
  signalCounts = mockSignalCounts,
  referencedItems = mockReferencedItems,
  suggestions = mockSuggestions,
  onApplyPrompt,
}: ChatContextRailProps) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 p-3" aria-label="Chat context">
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-100/60 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900/40">
        <ProjectSignals counts={signalCounts ?? null} />
        <ReferencedSection items={referencedItems} />
        <SuggestedSection prompts={suggestions} onApplyPrompt={onApplyPrompt} />
      </div>
    </aside>
  );
}