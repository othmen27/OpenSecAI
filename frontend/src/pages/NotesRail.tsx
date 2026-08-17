import ContextPill from "../components/workspace/ContextPill";
import RightRail, { RailSection, railEmptyTextClass } from "../components/workspace/RightRail";

/** A request/finding/report linked to the currently open note. */
export interface LinkedItem {
  id: string;
  kind: "request" | "finding" | "report";
  label: string;
}

/** Mock links mirroring the content of the open note. */
const mockLinkedItems: LinkedItem[] = [
  { id: "link-1", kind: "request", label: "POST /v1/auth/login" },
  { id: "link-2", kind: "finding", label: "Internal report endpoint exposed" },
  { id: "link-3", kind: "report", label: "acme.com auth flow review" },
];

interface NotesRailProps {
  linkedItems?: LinkedItem[];
}

/**
 * Right-hand rail for the Notes view: requests, findings and reports linked to
 * the currently open note.
 */
export default function NotesRail({ linkedItems = mockLinkedItems }: NotesRailProps) {
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