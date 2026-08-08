export default function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col gap-6 overflow-y-auto border-r border-neutral-800/80 bg-neutral-900/40 p-4">
      <Section title="modules" items={["projects", "history", "reports"]} />
      <Section title="analyzers" items={["jwt", "cookie", "http", "js"]} />
      <Section title="recon" items={["subdomains", "nuclei", "cve"]} status="soon" />
    </aside>
  );
}

function Section({ title, items, status }: { title: string; items: string[]; status?: "soon" }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
          {title}
        </p>
        {status && (
          <span className="rounded bg-neutral-800/70 px-1.5 py-0.5 font-mono text-[9px] uppercase text-neutral-500">
            soon
          </span>
        )}
      </div>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li
            key={item}
            className="cursor-default rounded-md px-2 py-1.5 font-mono text-xs text-neutral-400 transition-colors duration-150 hover:bg-neutral-800/50 hover:text-neutral-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}