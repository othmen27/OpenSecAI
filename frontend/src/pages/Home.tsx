export default function Home() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-2 font-mono text-xs text-neutral-600">// workspace v0.1</p>
      <h1 className="mb-6 font-mono text-2xl font-semibold tracking-tight text-neutral-100">
        OpenSecAI
      </h1>

      <div className="mb-8 rounded-lg border border-neutral-800/80 bg-neutral-900/60 p-5 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-neutral-500" />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            status
          </p>
        </div>
        <p className="font-mono text-sm leading-relaxed text-neutral-300">
          skeleton build. auth, analyzers, and tooling not implemented yet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Module name="analyzers" desc="jwt, cookie, http, js" state="pending" />
        <Module name="ai service" desc="llm routing" state="pending" />
        <Module name="recon" desc="subfinder, nuclei, cve" state="pending" />
      </div>
    </div>
  );
}

function Module({ name, desc, state }: { name: string; desc: string; state: string }) {
  return (
    <div className="group rounded-lg border border-neutral-800/80 bg-neutral-900/60 p-4 transition-all duration-150 hover:border-neutral-700 hover:bg-neutral-900">
      <p className="mb-1 font-mono text-xs font-semibold text-neutral-200">{name}</p>
      <p className="mb-3 font-mono text-[11px] text-neutral-500">{desc}</p>
      <span className="inline-flex items-center rounded-md bg-neutral-800/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400 group-hover:bg-neutral-800">
        {state}
      </span>
    </div>
  );
}