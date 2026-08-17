import { IconFile, IconHistory } from "@tabler/icons-react";

export type ContextPillIcon = "history" | "file";

interface ContextPillProps {
  label: string;
  /** History icon (requests) or file icon (files/findings/reports). */
  icon?: ContextPillIcon;
}

/**
 * Flat full-width "context pill" row — a muted history/file icon plus 12px
 * mono text on a surface one step lighter than the panel. Not a badge shape.
 */
export default function ContextPill({ label, icon = "file" }: ContextPillProps) {
  const Icon = icon === "history" ? IconHistory : IconFile;
  return (
    <li className="flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5 dark:bg-neutral-800">
      <Icon
        size={14}
        stroke={1.75}
        className="shrink-0 text-neutral-400 dark:text-neutral-500"
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-neutral-600 dark:text-neutral-400">
        {label}
      </span>
    </li>
  );
}