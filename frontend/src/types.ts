import type { Icon } from "@tabler/icons-react";

export interface Project {
  id: string;
  name: string;
  files?: string[];
  notes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type SignalSeverity = "high" | "warning" | "pass";

export interface Signal {
  id: string;
  severity: SignalSeverity;
  label: string;
}

export interface WorkspaceNavItem {
  path: string;
  label: string;
  Icon: Icon;
}