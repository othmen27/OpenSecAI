import RightRail, { RailSection, railEmptyTextClass } from "../components/workspace/RightRail";

export type ReportFormat = "Markdown" | "HTML" | "PDF";

const defaultFormats: ReportFormat[] = ["Markdown", "HTML", "PDF"];

interface ReportsRailProps {
  formats?: ReportFormat[];
  /** Stub handler for report generation — real logic comes later. */
  onGenerate?: (format: ReportFormat) => void;
}

/**
 * Right-hand rail for the Reports view: compact bordered rows for kicking off
 * a new report in each format.
 */
export default function ReportsRail({ formats = defaultFormats, onGenerate }: ReportsRailProps) {
  return (
    <RightRail>
      <RailSection label="Generate new">
        {formats.length > 0 ? (
          <div className="space-y-1.5">
            {formats.map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => onGenerate?.(format)}
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-left text-[12px] text-accent-600 transition-colors hover:border-accent-300 hover:bg-accent-50 dark:border-neutral-700 dark:text-accent-300 dark:hover:border-accent-700 dark:hover:bg-accent-950"
              >
                {format}
              </button>
            ))}
          </div>
        ) : (
          <p className={railEmptyTextClass}>No report formats available</p>
        )}
      </RailSection>
    </RightRail>
  );
}