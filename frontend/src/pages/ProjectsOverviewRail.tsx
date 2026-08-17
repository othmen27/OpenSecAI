import SignalStat from "../components/workspace/SignalStat";
import RightRail, { RailSection, railEmptyTextClass } from "../components/workspace/RightRail";

interface OverviewStat {
  id: string;
  value: string | number;
  label: string;
}

interface ActivityRow {
  id: string;
  description: string;
  /** Relative timestamp, shown right-aligned and muted. */
  time: string;
}

/** Mock overview stats — wire to real aggregates later. */
const mockStats: OverviewStat[] = [
  { id: "stat-projects", value: "3", label: "projects" },
  { id: "stat-findings", value: "14", label: "open findings" },
  { id: "stat-recent", value: "acme.com", label: "most recent" },
];

/** Mock recent cross-project activity. */
const mockActivity: ActivityRow[] = [
  { id: "act-1", description: "New finding on acme.com", time: "2 min ago" },
  { id: "act-2", description: "3 subdomains found on globex-bank", time: "1 h ago" },
  { id: "act-3", description: "Static scan completed on initech-api", time: "3 h ago" },
  { id: "act-4", description: "Auth flow review started on acme.com", time: "1 d ago" },
];

/**
 * Right-hand rail for the project overview (shown before a project opens).
 * Quick cross-project stats plus a recent-activity feed.
 */
export default function ProjectsOverviewRail() {
  return (
    <RightRail>
      <RailSection label="Quick stats">
        {mockStats.length > 0 ? (
          <div className="flex gap-3">
            {mockStats.map((stat) => (
              <SignalStat key={stat.id} label={stat.label} value={stat.value} />
            ))}
          </div>
        ) : (
          <p className={railEmptyTextClass}>No stats yet</p>
        )}
      </RailSection>

      <RailSection label="Recent activity">
        {mockActivity.length > 0 ? (
          <ul>
            {mockActivity.map((activity, index) => (
              <li
                key={activity.id}
                className={`flex items-baseline gap-3 py-1.5 ${
                  index > 0 ? "border-t border-neutral-200 dark:border-neutral-800" : ""
                }`}
              >
                <span className="min-w-0 flex-1 truncate text-[13px] text-neutral-600 dark:text-neutral-400">
                  {activity.description}
                </span>
                <span className="shrink-0 text-[12px] text-neutral-400 dark:text-neutral-500">
                  {activity.time}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={railEmptyTextClass}>No recent activity</p>
        )}
      </RailSection>
    </RightRail>
  );
}