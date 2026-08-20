import Prism from "prismjs";

// Prism's individual language files (prismmarkup.js, prism-bash.js, ...) reference
// the free `Prism` identifier, which in a browser is normally provided by a
// <script> tag. Vite's CJS→ESM interop does not guarantee that global exists,
// so we expose the core explicitly before any language module is loaded.
const g = globalThis as unknown as { Prism: typeof Prism };
g.Prism = Prism;

// We highlight code inside React-rendered HTML ourselves; stop Prism from
// auto-scanning the DOM on load (which would miss our dynamically inserted code).
Prism.manual = true;

export default Prism;