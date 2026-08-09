/**
 * Shared styling for sidebar rows (projects + workspace nav).
 *
 * Flat rows, no borders or shadows — the active state is a subtle background
 * fill only, so both sidebar sections stay visually identical.
 */
export function sidebarRowClass(isActive: boolean): string {
  const base =
    "flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors";

  return isActive
    ? `${base} bg-neutral-200/70 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100`
    : `${base} text-neutral-600 hover:bg-neutral-200/40 dark:text-neutral-400 dark:hover:bg-neutral-800/50`;
}
