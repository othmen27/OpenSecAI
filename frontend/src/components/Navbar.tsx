import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-800/80 bg-neutral-900/80 px-6 backdrop-blur-sm">
      <Link
        to="/"
        className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-neutral-100 transition-colors hover:text-white no-underline"
      >
        OpenSecAI
      </Link>
      <nav className="flex items-center gap-1">
        <NavLink to="/chat">chat</NavLink>
        <NavLink to="/login">login</NavLink>
      </nav>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-1.5 font-mono text-xs text-neutral-400 transition-all duration-150 hover:bg-neutral-800/60 hover:text-neutral-100 no-underline"
    >
      {children}
    </Link>
  );
}