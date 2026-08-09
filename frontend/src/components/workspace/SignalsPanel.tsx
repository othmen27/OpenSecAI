import SignalRow from "./SignalRow";
import type { Signal } from "../../types";

interface SignalsPanelProps {
  signals: Signal[];
}

export default function SignalsPanel({ signals }: SignalsPanelProps) {
  return (
    <aside className="flex h-full flex-col overflow-hidden border-l border-neutral-200 bg-neutral-100/60 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900/40">
      <p className="px-1 pb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
        Signals
      </p>
      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {signals.map((signal) => (
          <SignalRow key={signal.id} signal={signal} />
        ))}
      </ul>
    </aside>
  );
}