import type { Signal } from "../types";

export const mockContext = "auth flow";

export const requestContent = `GET /v1/auth/session HTTP/1.1
Host: acme.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36
Accept: application/json
Accept-Language: en-US,en;q=0.9
Cookie: session_id=8f9c4e2a7b1d6c5e4f3a2b1c; theme=dark; _ga=GA1.2.8841203
X-Request-Id: req_01J7FK3MS0N8Q`;

export const annotationText =
  "The request sets session_id as a plain cookie — no HttpOnly or Secure flags, and it is issued on a shared parent domain. Combined with the missing CSP header seen in the paired response, a reflected XSS on any subdomain could read this session directly. Moving to an explicit cookie prefix and SameSite=Strict would close the practical attack path.";

export const mockSignals: Signal[] = [
  { id: "sig-1", severity: "high", label: "Session cookie missing HttpOnly and Secure flags" },
  { id: "sig-2", severity: "warning", label: "CSP response header not set" },
  { id: "sig-3", severity: "pass", label: "TLS 1.3 negotiated, no weak ciphers detected" },
];