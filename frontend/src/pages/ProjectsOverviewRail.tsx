import SignalStat from "../components/workspace/SignalStat";
import RightRail, { RailSection, railEmptyTextClass } from "../components/workspace/RightRail";
import { useProjects } from "../providers/ProjectsProvider";

/** Compact relative timestamp (e.g. "5m ago") for a project's createdAt. */
function timeAgo(iso?: string): string {
  if (!iso) return "just now";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "just now";
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Right-hand rail for the project overview (shown before a project opens).
 * Quick stats plus a recent-activity feed, both derived from the projects
 * returned by the gateway's GET /projects.
 */
export default function ProjectsOverviewRail() {
  const { projects, loading } = useProjects();

  const byNewest = [...projects].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
  );
  const mostRecent = byNewest[0] ?? null;

  const stats = [
    { id: "stat-projects", value: projects.length, label: "projects" },
    { id: "stat-recent", value: mostRecent?.name ?? "—", label: "most recent" },
  ];

  const activity = byNewest.map((project) => ({
    id: `act-${project.id}`,
    description: `${project.name} created`,
    time: timeAgo(project.createdAt),
  }));

  return (
    <RightRail>
      <RailSection label="Quick stats">
        {stats.length > 0 ? (
          <div className="flex gap-3">
            {stats.map((stat) => (
              <SignalStat key={stat.id} label={stat.label} value={stat.value} />
            ))}
          </div>
        ) : (
          <p className={railEmptyTextClass}>No stats yet</p>
        )}
      </RailSection>

      <RailSection label="Recent activity">
        {loading && activity.length === 0 ? (
          <p className={railEmptyTextClass}>Loading activity…</p>
        ) : activity.length > 0 ? (
          <ul>
            {activity.map((activity, index) => (
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