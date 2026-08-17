interface SignalStatProps {
  label: string;
  /** Headline value — usually a count, sometimes a short label (e.g. project name). */
  value: string | number;
  /** Text color for the headline value; defaults to the accent-neutral stat look. */
  valueClass?: string;
}

/**
 * One stat in an inline stat-group row: 16px medium value with an 11px muted
 * label directly beneath. Shared by every rail that shows a rollup/summary.
 */
export default function SignalStat({
  label,
  value,
  valueClass = "text-neutral-900 dark:text-neutral-100",
}: SignalStatProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className={`truncate text-base font-medium leading-none ${valueClass}`}>{value}</span>
      <span className="truncate text-[11px] leading-none text-neutral-400 dark:text-neutral-500">
        {label}
      </span>
    </div>
  );
}