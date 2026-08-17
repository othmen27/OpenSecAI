import RightRail, { RailSection } from "../components/workspace/RightRail";

/** Details for a binary selected in the center panel, if any. */
export interface BinaryDetails {
  architecture: string;
  sha256: string;
  size: string;
  tool: "Ghidra" | "IDA";
}

interface BinaryAnalysisRailProps {
  binary: BinaryDetails | null;
}

export default function BinaryAnalysisRail({ binary }: BinaryAnalysisRailProps) {
  if (!binary) {
    return (
      <RightRail>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <p className="text-[13px] text-neutral-400 dark:text-neutral-500">
            Select a binary to see details
          </p>
        </div>
      </RightRail>
    );
  }

  const rows = [
    { label: "Architecture", value: binary.architecture, mono: false },
    { label: "SHA256", value: binary.sha256, mono: true },
    { label: "Size", value: binary.size, mono: false },
    { label: "Source", value: binary.tool, mono: false },
  ];

  return (
    <RightRail>
      <RailSection label="Binary details">
        <dl className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-[12px] text-neutral-400 dark:text-neutral-500">
                {row.label}
              </dt>
              <dd
                className={`min-w-0 flex-1 truncate text-right text-[13px] text-neutral-700 dark:text-neutral-300 ${
                  row.mono ? "font-mono" : ""
                }`}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </RailSection>
    </RightRail>
  );
}