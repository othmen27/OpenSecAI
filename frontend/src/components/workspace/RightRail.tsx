import type { ReactNode } from "react";

const railLabelClass =
  "pb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500";

/** Quiet muted text style shared by every rail's graceful empty state. */
export const railEmptyTextClass = "text-[12px] text-neutral-400 dark:text-neutral-500";

interface RightRailProps {
  children: ReactNode;
}

/**
 * Generic right-hand "rail" shell shared by every workspace route.
 *
 * Fixed 260px width, same surface language as the rest of the app (surface
 * background, hairline border, rounded-xl, no shadows). Children are stacked
 * sections with generous spacing.
 */
export default function RightRail({ children }: RightRailProps) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 p-3" aria-label="Workspace rail">
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-100/60 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900/40">
        {children}
      </div>
    </aside>
  );
}

interface RailSectionProps {
  label: string;
  children: ReactNode;
}

/** A single labelled section within a RightRail. */
export function RailSection({ label, children }: RailSectionProps) {
  return (
    <section className="min-h-0" aria-label={label}>
      <p className={railLabelClass}>{label}</p>
      {children}
    </section>
  );
}