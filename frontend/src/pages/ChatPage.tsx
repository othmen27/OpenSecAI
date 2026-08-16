import { useRef } from "react";
import { IconUser } from "@tabler/icons-react";
import PageHeader from "../components/workspace/PageHeader";
import AIAnnotation from "../components/workspace/AIAnnotation";
import ChatInput, { type ChatInputHandle } from "../components/workspace/ChatInput";
import ChatContextRail from "../components/workspace/ChatContextRail";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";

interface ChatTurn {
  id: string;
  author: "user" | "ai";
  content: string;
}

/** Mock conversation — same annotation style as the request inspector. */
const mockTurns: ChatTurn[] = [
  {
    id: "turn-1",
    author: "user",
    content: "Walk me through the auth flow where does the session token get set?",
  },
  {
    id: "turn-2",
    author: "ai",
    content:
      "The token is written to the session cookie on POST /v1/auth/login without HttpOnly or Secure, then read back on every /v1/auth/session call. I would flag the cookie flags before touching anything else.",
  },
  {
    id: "turn-3",
    author: "user",
    content: "Can you compare this against the globex-bank login handler?",
  },
];

interface UserMessageProps {
  content: string;
}

/** User turn — neutral circular avatar, otherwise the annotation look. */
function UserMessage({ content }: UserMessageProps) {
  return (
    <section className="flex items-start gap-3">
      <span className="mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
        <IconUser size={13} stroke={1.75} aria-hidden="true" />
      </span>
      <p className="max-w-[65ch] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        {content}
      </p>
    </section>
  );
}

export default function ChatPage() {
  const { project } = useWorkspaceContext();
  const chatInputRef = useRef<ChatInputHandle>(null);

  /** Suggested-prompt click: fill the chat input and focus it — never auto-send. */
  const applyPrompt = (prompt: string) => {
    chatInputRef.current?.setValue(prompt);
    chatInputRef.current?.focus();
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PageHeader title={project?.name ?? "Project"} context="Chat" />

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          {mockTurns.map((turn) =>
            turn.author === "user" ? (
              <UserMessage key={turn.id} content={turn.content} />
            ) : (
              <AIAnnotation key={turn.id} content={turn.content} />
            ),
          )}
        </div>

        <div className="shrink-0 px-6 pb-5">
          <ChatInput
            ref={chatInputRef}
            placeholder="Ask about this project"
            onSend={() => undefined}
          />
        </div>
      </div>

      <ChatContextRail onApplyPrompt={applyPrompt} />
    </div>
  );
}