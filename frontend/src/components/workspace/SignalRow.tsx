import type { Signal, SignalSeverity } from "../../types";

const severityDotStyles: Record<SignalSeverity, string> = {
  high: "bg-red-500",
  warning: "bg-amber-500",
  pass: "bg-emerald-500",
};

interface SignalRowProps {
  signal: Signal;
}

export default function SignalRow({ signal }: SignalRowProps) {
  return (
    <li className="flex items-center gap-2 py-0.5">
      <span
        className={`size-1.5 shrink-0 rounded-full ${severityDotStyles[signal.severity]}`}
        aria-hidden="true"
      />
      <p className="text-[12px] leading-snug text-neutral-600 dark:text-neutral-400">
        {signal.label}
      </p>
    </li>
  );
}