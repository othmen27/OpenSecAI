import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto max-w-sm">
      <p className="mb-2 font-mono text-xs text-neutral-600">// auth disabled</p>
      <h1 className="mb-8 font-mono text-2xl font-semibold tracking-tight text-neutral-100">
        login
      </h1>

      <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
        <Field label="email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-neutral-800 bg-neutral-900/70 px-3 py-2 font-mono text-sm text-neutral-200 placeholder-neutral-600 transition-colors focus:border-neutral-600 focus:bg-neutral-900 focus:outline-none"
          />
        </Field>

        <Field label="password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full rounded-md border border-neutral-800 bg-neutral-900/70 px-3 py-2 font-mono text-sm text-neutral-200 placeholder-neutral-600 transition-colors focus:border-neutral-600 focus:bg-neutral-900 focus:outline-none"
          />
        </Field>

        <button
          type="submit"
          disabled
          className="mt-2 cursor-not-allowed rounded-md bg-neutral-800/70 px-4 py-2 font-mono text-xs uppercase tracking-wider text-neutral-500"
        >
          unavailable until auth is built
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs text-neutral-500">{label}</span>
      {children}
    </label>
  );
}