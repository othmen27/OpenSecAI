import { useEffect, useRef, useState } from "react";
import { IconUser } from "@tabler/icons-react";
import PageHeader from "../components/workspace/PageHeader";
import AIAnnotation from "../components/workspace/AIAnnotation";
import ChatInput, { type ChatInputHandle } from "../components/workspace/ChatInput";
import ChatContextRail from "./ChatContextRail";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";
import { http } from "../api/http";
import MarkdownContent from "../components/workspace/MarkdownContent";
import type { Conversation, Message } from "../types"; 
interface UserMessageProps {
  content: string;
}

function UserMessage({ content }: UserMessageProps) {
  return (
    <section className="flex items-start gap-3">
      <span className="mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
        <IconUser size={13} stroke={1.75} aria-hidden="true" />
      </span>
      <MarkdownContent content={content} className="max-w-[65ch]" />
    </section>
  );
}

export default function ChatPage() {
  const { project } = useWorkspaceContext();
  const projectId = project?.id;

  const chatInputRef = useRef<ChatInputHandle>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Ensure a conversation exists for the project, then load its messages.
  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { conversations } = await http
          .get(`/projects/${projectId}/conversations`)
          .json<{ conversations: Conversation[] }>();
        let id = conversations[0]?.id ?? null;
        if (!id) {
          const created = await http
            .post(`/projects/${projectId}/conversations`)
            .json<{ conversation: Conversation }>();
          id = created.conversation.id;
        }
        if (cancelled) return;
        setConversationId(id);
        const { messages: msgs } = await http
          .get(`/conversations/${id}/messages`)
          .json<{ messages: Message[] }>();
        if (!cancelled) setMessages(msgs ?? []);
      } catch (error) {
        console.error(error);
        if (!cancelled) setLastError("Failed to load conversation");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const applyPrompt = (prompt: string) => {
    chatInputRef.current?.setValue(prompt);
    chatInputRef.current?.focus();
  };

  const handleSend = async (content: string) => {
    if (!conversationId) return;
    setSending(true);
    setLastError(null);
    setMessages((prev) => [...prev, { id: `pending-${Date.now()}`, role: "user", content }]);
    try {
      const response = await http
        .post(`/conversations/${conversationId}/chat`, { json: { content } })
        .json<{ userMessage: Message; assistantMessage?: Message }>();
      setMessages((prev) =>
        prev
          .filter((message) => !message.id.startsWith("pending-"))
          .concat([response.userMessage])
          .concat(response.assistantMessage ? [response.assistantMessage] : []),
      );
    } catch (error) {
      console.error(error);
      setLastError("Couldn't reach the AI service — your message was still saved.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PageHeader title={project?.name ?? "Project"} context="Chat" />

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          {loading ? (
            <p className="text-[13px] text-neutral-400 dark:text-neutral-500">Loading conversation…</p>
          ) : messages.length > 0 ? (
            messages.map((message) =>
              message.role === "user" ? (
                <UserMessage key={message.id} content={message.content} />
              ) : (
                <AIAnnotation key={message.id} content={message.content} />
              ),
            )
          ) : (
            <p className="text-[13px] text-neutral-400 dark:text-neutral-500">
              Ask about this project to start a conversation.
            </p>
          )}
          {lastError ? (
            <p className="text-[12px] text-red-500 dark:text-red-400">{lastError}</p>
          ) : null}
        </div>

        <div className="shrink-0 px-6 pb-5">
          {sending ? (
            <p className="mb-2 text-[12px] text-neutral-400 dark:text-neutral-500">
              Thinking…
            </p>
          ) : null}
          <ChatInput
            ref={chatInputRef}
            placeholder="Ask about this project"
            onSend={(text) => void handleSend(text)}
          />
        </div>
      </div>

      <ChatContextRail onApplyPrompt={applyPrompt} />
    </div>
  );
}