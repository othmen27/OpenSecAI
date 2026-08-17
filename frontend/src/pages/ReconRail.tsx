import RightRail, { RailSection, railEmptyTextClass } from "../components/workspace/RightRail";

interface ScanRun {
  id: string;
  /** Relative timestamp, shown right-aligned and muted. */
  time: string;
  result: string;
}

/** Mock past scan runs. */
const mockScans: ScanRun[] = [
  { id: "scan-1", time: "2 h ago", result: "14 subdomains found" },
  { id: "scan-2", time: "1 d ago", result: "9 subdomains found" },
  { id: "scan-3", time: "3 d ago", result: "11 subdomains found" },
];

/**
 * Right-hand rail for the Recon view: a flat history of past scan runs.
 */
export default function ReconRail() {
  return (
    <RightRail>
      <RailSection label="Scan history">
        {mockScans.length > 0 ? (
          <ul>
            {mockScans.map((scan, index) => (
              <li
                key={scan.id}
                className={`flex items-baseline gap-3 py-1.5 ${
                  index > 0 ? "border-t border-neutral-200 dark:border-neutral-800" : ""
                }`}
              >
                <span className="min-w-0 flex-1 truncate text-[13px] text-neutral-600 dark:text-neutral-400">
                  {scan.result}
                </span>
                <span className="shrink-0 text-[12px] text-neutral-400 dark:text-neutral-500">
                  {scan.time}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={railEmptyTextClass}>No scans yet</p>
        )}
      </RailSection>
    </RightRail>
  );
}