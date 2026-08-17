import ContextPill from "../components/workspace/ContextPill";
import SignalStat from "../components/workspace/SignalStat";
import RightRail, { RailSection, railEmptyTextClass } from "../components/workspace/RightRail";

export interface SignalCounts {
  high: number;
  medium: number;
  info: number;
}


export interface ReferencedItem {
  id: string;
  kind: "request" | "file";
  label: string;
}

interface ChatContextRailProps {
  signalCounts?: SignalCounts | null;
  referencedItems?: ReferencedItem[];
  suggestions?: string[];
  onApplyPrompt?: (prompt: string) => void;
}

const mockSignalCounts: SignalCounts = { high: 2, medium: 1, info: 1 };

const mockReferencedItems: ReferencedItem[] = [
  { id: "ctx-1", kind: "request", label: "POST /v1/auth/login" },
  { id: "ctx-2", kind: "file", label: "src/middleware/session.ts" },
  { id: "ctx-3", kind: "request", label: "GET /v1/auth/session" },
];

const mockSuggestions = ["Generate a fix for the cookie flags", "Draft a finding for this"];

interface ProjectSignalsProps {
  counts: SignalCounts | null;
}

function ProjectSignals({ counts }: ProjectSignalsProps) {
  return (
    <RailSection label="Project signals">
      {counts ? (
        <div className="flex gap-3">
          <SignalStat label="high" value={counts.high} valueClass="text-red-500 dark:text-red-400" />
          <SignalStat label="medium" value={counts.medium} valueClass="text-amber-500 dark:text-amber-400" />
          <SignalStat label="info" value={counts.info} valueClass="text-neutral-400 dark:text-neutral-500" />
        </div>
      ) : (
        <p className={railEmptyTextClass}>No signals yet</p>
      )}
    </RailSection>
  );
}

interface ReferencedSectionProps {
  items: ReferencedItem[];
}

function ReferencedSection({ items }: ReferencedSectionProps) {
  return (
    <RailSection label="Referenced in this chat">
      {items.length > 0 ? (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <ContextPill
              key={item.id}
              label={item.label}
              icon={item.kind === "request" ? "history" : "file"}
            />
          ))}
        </ul>
      ) : (
        <p className={railEmptyTextClass}>Nothing referenced yet</p>
      )}
    </RailSection>
  );
}

interface SuggestedSectionProps {
  prompts: string[];
  onApplyPrompt?: (prompt: string) => void;
}

function SuggestedSection({ prompts, onApplyPrompt }: SuggestedSectionProps) {
  return (
    <RailSection label="Suggested">
      {prompts.length > 0 ? (
        <div className="space-y-1.5">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onApplyPrompt?.(prompt)}
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-left text-[12px] text-accent-600 transition-colors hover:border-accent-300 hover:bg-accent-50 dark:border-neutral-700 dark:text-accent-300 dark:hover:border-accent-700 dark:hover:bg-accent-950"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : (
        <p className={railEmptyTextClass}>Nothing suggested yet</p>
      )}
    </RailSection>
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
    <RightRail>
      <ProjectSignals counts={signalCounts ?? null} />
      <ReferencedSection items={referencedItems} />
      <SuggestedSection prompts={suggestions} onApplyPrompt={onApplyPrompt} />
    </RightRail>
  );
}