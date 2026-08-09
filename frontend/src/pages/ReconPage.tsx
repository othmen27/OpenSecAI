import PageHeader from "../components/workspace/PageHeader";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";

interface ReconStat {
  id: string;
  value: string;
  label: string;
}

interface Subdomain {
  id: string;
  name: string;
  alive: boolean;
}

const mockStats: ReconStat[] = [
  { id: "stat-1", value: "12", label: "subdomains" },
  { id: "stat-2", value: "3", label: "new since last scan" },
  { id: "stat-3", value: "2", label: "CVEs matched" },
];

const mockSubdomains: Subdomain[] = [
  { id: "sub-1", name: "api.acme.com", alive: true },
  { id: "sub-2", name: "app.acme.com", alive: true },
  { id: "sub-3", name: "dev.acme.com", alive: true },
  { id: "sub-4", name: "staging.acme.com", alive: false },
  { id: "sub-5", name: "old.acme.com", alive: false },
];

export default function ReconPage() {
  const { project } = useWorkspaceContext();

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader title={project?.name ?? "Project"} context="Recon" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex items-baseline gap-8 px-3 pb-6">
          {mockStats.map((stat) => (
            <div key={stat.id} className="flex items-baseline gap-1.5">
              <span className="text-lg font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
                {stat.value}
              </span>
              <span className="text-[12px] text-neutral-400 dark:text-neutral-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <ul className="space-y-0.5">
          {mockSubdomains.map((subdomain) => (
            <li key={subdomain.id}>
              <div className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px]">
                <span
                  className={
                    subdomain.alive
                      ? "size-1.5 shrink-0 rounded-full bg-emerald-500"
                      : "size-1.5 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600"
                  }
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate font-mono text-neutral-700 dark:text-neutral-300">
                  {subdomain.name}
                </span>
                <span className="shrink-0 text-[12px] text-neutral-400 dark:text-neutral-500">
                  {subdomain.alive ? "alive" : "no response"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}