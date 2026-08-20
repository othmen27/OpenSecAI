// Static registration of the languages most likely to appear in AI/user
// markdown. Order matters: `./prism` runs first so globalThis.Prism exists
// before these side-effect modules execute.
import "./prism";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-python";
import "prismjs/components/prism-go";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-http";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-nginx";