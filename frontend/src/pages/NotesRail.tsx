import ContextPill from "../components/workspace/ContextPill";
import RightRail, { RailSection, railEmptyTextClass } from "../components/workspace/RightRail";

/** A request/finding/report linked to the currently open note. */
export interface LinkedItem {
  id: string;
  kind: "request" | "finding" | "report";
  label: string;
}

interface NotesRailProps {
  linkedItems?: LinkedItem[];
}

/**
 * Right-hand rail for the Notes view: requests, findings and reports linked to
 * the currently open note.
 */
export default function NotesRail({ linkedItems = [] }: NotesRailProps) {
  return (
    <RightRail>
      <RailSection label="Linked to this note">
        {linkedItems.length > 0 ? (
          <ul className="space-y-1.5">
            {linkedItems.map((item) => (
              <ContextPill
                key={item.id}
                label={item.label}
                icon={item.kind === "request" ? "history" : "file"}
              />
            ))}
          </ul>
        ) : (
          <p className={railEmptyTextClass}>Nothing linked yet</p>
        )}
      </RailSection>
    </RightRail>
  );
}