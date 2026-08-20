// Prism ships its languages as per-language side-effect modules
// (prismjs/components/prism-*.js) that register themselves on the global Prism
// object. The Node loader (components/index.js) uses `require.resolve` and is
// NOT browser-safe, so we import these modules directly instead.
declare module "prismjs/components/prism-*" {}