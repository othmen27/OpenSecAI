import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  /** Optional second segment shown muted after `title`, e.g. the section name. */
  context?: string;
  /** Right-aligned action slot; defaults to a quiet more-options button. */
  action?: ReactNode;
}

function MoreButton() {
  return (
    <button
      type="button"
      aria-label="More options"
      className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200/50 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-300"
    >
      <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden="true">
        <circle cx="10" cy="4.5" r="1.25" />
        <circle cx="10" cy="10" r="1.25" />
        <circle cx="10" cy="15.5" r="1.25" />
      </svg>
    </button>
  );
}

export default function PageHeader({ title, context, action }: PageHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-200 px-6 py-3.5 dark:border-neutral-800">
      <h1 className="min-w-0 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {title}
        {context ? (
          <span className="font-normal text-neutral-400 dark:text-neutral-500"> / {context}</span>
        ) : null}
      </h1>
      {action ?? <MoreButton />}
    </header>
  );
}