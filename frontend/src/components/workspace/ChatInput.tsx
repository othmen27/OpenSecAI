import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
} from "react";

interface ChatInputProps {
  placeholder?: string;
  onSend: (message: string) => void;
}

/** Imperative handle so callers (e.g. the context rail) can fill + focus the input. */
export interface ChatInputHandle {
  setValue: (value: string) => void;
  focus: () => void;
}

const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(function ChatInput(
  { placeholder = "Ask about this request", onSend },
  ref,
) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    setValue,
    focus: () => inputRef.current?.focus(),
  }));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white py-1 pl-3.5 pr-1.5 transition-colors focus-within:border-accent-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus-within:border-accent-400"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent py-2 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 dark:text-neutral-200 dark:placeholder:text-neutral-500"
      />
      <button
        type="submit"
        aria-label="Send"
        disabled={!value.trim()}
        className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-neutral-400 transition-colors enabled:hover:text-accent-500 disabled:cursor-default disabled:opacity-40 dark:text-neutral-500 dark:enabled:hover:text-accent-400"
      >
        <svg
          viewBox="0 0 16 16"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 8h10.5" />
          <path d="M9 3.5 13.5 8 9 12.5" />
        </svg>
      </button>
    </form>
  );
});

export default ChatInput;