import {
  IconBinary,
  IconCode,
  IconHistory,
  IconMessageCircle,
  IconNotes,
  IconRadar2,
  IconReport,
} from "@tabler/icons-react";
import type { WorkspaceNavItem } from "../../types";

/**
 * Left sidebar "Workspace" section — one icon + label row per route.
 * Paths are suffixes resolved under `/projects/:projectId`.
 */
export const workspaceNavItems: WorkspaceNavItem[] = [
  { path: "/chat", label: "Chat", Icon: IconMessageCircle },
  { path: "/http-history", label: "HTTP history", Icon: IconHistory },
  { path: "/js-analysis", label: "JS analysis", Icon: IconCode },
  { path: "/notes", label: "Notes", Icon: IconNotes },
  { path: "/recon", label: "Recon", Icon: IconRadar2 },
  { path: "/binary", label: "Binary analysis", Icon: IconBinary },
  { path: "/reports", label: "Reports", Icon: IconReport },
];