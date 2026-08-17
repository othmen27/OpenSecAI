import SignalStat from "../components/workspace/SignalStat";
import RightRail, { RailSection, railEmptyTextClass } from "../components/workspace/RightRail";

const mockSummary = { endpoints: 36, secrets: 3, files: 3 };
const mockDelta = { endpoints: 3, secrets: 1 };


export default function JsAnalysisRail() {
  const hasChanges = mockDelta.endpoints > 0 || mockDelta.secrets > 0;
  const deltaText = [
    `+${mockDelta.endpoints} endpoint${mockDelta.endpoints === 1 ? "" : "s"}`,
    `+${mockDelta.secrets} secret${mockDelta.secrets === 1 ? "" : "s"}`,
  ].join(", ");

  return (
    <RightRail>
      <RailSection label="Scan summary">
        {mockSummary ? (
          <div className="flex gap-3">
            <SignalStat label="endpoints" value={mockSummary.endpoints} />
            <SignalStat label="secrets" value={mockSummary.secrets} />
            <SignalStat label="files" value={mockSummary.files} />
          </div>
        ) : (
          <p className={railEmptyTextClass}>No scans yet</p>
        )}
      </RailSection>

      <RailSection label="Since last scan">
        <p
          className={
            hasChanges
              ? "text-[13px] text-accent-600 dark:text-accent-300"
              : "text-[13px] text-neutral-400 dark:text-neutral-500"
          }
        >
          {hasChanges ? deltaText : "No changes since last scan"}
        </p>
      </RailSection>
    </RightRail>
  );
}