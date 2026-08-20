import type { Icon } from "@tabler/icons-react";

export interface Project {
  id: string;
  name: string;
  files?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteAttachment {
  id: string;
  noteId?: string;
  filePath?: string;
  originalName?: string;
  mimeType?: string;
  createdAt?: string;
}

export interface Note {
  id: string;
  content: string;
  filePath?: string | null;
  attachments?: NoteAttachment[];
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Conversation {
  id: string;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId?: string;
  role: string;
  content: string;
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