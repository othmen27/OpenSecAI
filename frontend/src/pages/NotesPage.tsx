import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { IconFileText, IconPaperclip, IconPlus, IconX } from "@tabler/icons-react";
import PageHeader from "../components/workspace/PageHeader";
import NotesRail, { type LinkedItem } from "./NotesRail";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";
import MarkdownContent from "../components/workspace/MarkdownContent";
import { http } from "../api/http";
import type { Note, NoteAttachment } from "../types";

const MARKER_RE = /\{\{file:(\d+)\}\}/g;

const inputBaseClass =
  "w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-[13px] leading-relaxed text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-accent-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300 dark:placeholder:text-neutral-500";

const subtleButtonClass =
  "shrink-0 rounded-md px-2.5 py-1.5 text-[12px] text-neutral-400 transition-colors hover:bg-neutral-200/50 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-300";

/** Raw gateway base URL — used for multipart uploads and inline attachment URLs. */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function attachmentUrl(noteId: string, attachmentId: string, download: boolean): string {
  return `${API_BASE}/notes/${noteId}/attachments/${attachmentId}/file${
    download ? "?download=1" : ""
  }`;
}

function AttachmentMedia({
  note,
  attachment,
  index,
}: {
  note: Note;
  attachment?: NoteAttachment;
  index: number;
}) {
  if (!attachment) {
    return (
      <span className="text-[12px] text-red-400">{`Missing attachment {{file:${index}}}`}</span>
    );
  }
  const name = attachment.originalName ?? attachment.filePath?.split("/").pop() ?? "file";
  const isImage = attachment.mimeType?.startsWith("image/");
  const src = attachmentUrl(note.id, attachment.id, false);
  const href = attachmentUrl(note.id, attachment.id, true);
  if (isImage) {
    return (
      <a href={href} target="_blank" rel="noreferrer" title={name}>
        <img
          src={src}
          alt={name}
          className="max-h-48 max-w-full rounded-md border border-neutral-200 object-contain dark:border-neutral-800"
        />
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-neutral-200 px-2 py-1 text-[12px] text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-200"
    >
      <IconFileText size={13} stroke={1.75} aria-hidden="true" className="shrink-0" />
      <span className="truncate">{name}</span>
    </a>
  );
}

/** Splits note.content into interleaved text blocks and inline attachment rows. */
function renderNoteBody(note: Note): ReactNode[] {
  const attachments = note.attachments ?? [];
  const parts = note.content.split(MARKER_RE);
  const nodes: ReactNode[] = [];
  let row: { index: number; key: string }[] = [];

  const flushRow = () => {
    if (row.length === 0) return;
    nodes.push(
      <div key={`row-${nodes.length}`} className="flex flex-wrap items-center gap-2 py-1">
        {row.map((item) => (
          <AttachmentMedia
            key={item.key}
            note={note}
            index={item.index}
            attachment={attachments[item.index]}
          />
        ))}
      </div>,
    );
    row = [];
  };

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      flushRow();
      const text = parts[i];
      if (text) {
        nodes.push(
          <MarkdownContent key={`text-${i}`} content={text} />,
        );
      }
    } else {
      const index = Number(parts[i]);
      row.push({ index, key: `att-${i}-${index}` });
    }
  }
  flushRow();
  return nodes;
}

export default function NotesPage() {
  const { project } = useWorkspaceContext();
  const projectId = project?.id;

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const composerTextareaRef = useRef<HTMLTextAreaElement>(null);

  const linkedItems: LinkedItem[] = (project?.files ?? []).map((file, index) => ({
    id: `file-${index}`,
    kind: "report",
    label: file,
  }));

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    setLoading(true);
    http
      .get(`/projects/${projectId}/notes`)
      .json<{ notes: Note[] }>()
      .then((response) => {
        if (!cancelled) setNotes(response.notes ?? []);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setNotes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const handleToggleComposer = () => {
    setComposerOpen((open) => !open);
  };

  const insertMarkersAtCursor = (current: string, markers: string): string => {
    const textarea = composerTextareaRef.current;
    if (!textarea) return current + markers;
    const start = textarea.selectionStart ?? current.length;
    const end = textarea.selectionEnd ?? current.length;
    return current.slice(0, start) + markers + current.slice(end);
  };

  const handleAttachFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const start = pendingFiles.length;
    const markers = list.map((_, i) => `{{file:${start + i}}}`).join("");
    setDraft((current) => insertMarkersAtCursor(current, markers));
    setPendingFiles((prev) => [...prev, ...list]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    setDraft((current) => {
      let next = current.replace(`{{file:${index}}}`, "");
      for (let i = index + 1; ; i++) {
        const marker = `{{file:${i}}}`;
        if (next.includes(marker)) {
          next = next.replace(marker, `{{file:${i - 1}}}`);
        } else {
          break;
        }
      }
      return next;
    });
  };

  const handleAddNote = async () => {
    if (!projectId) return;
    if (draft.trim().length === 0 && pendingFiles.length === 0) return;
    setSaving(true);
    setSaveFailed(false);
    try {
      const response = await http
        .post(`/projects/${projectId}/notes`, { json: { content: draft } })
        .json<{ note: Note }>();
      let note = response.note;
      for (const file of pendingFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await fetch(`${API_BASE}/notes/${note.id}/attachments`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!uploadResponse.ok) throw new Error("File upload failed");
        const uploadData = (await uploadResponse.json()) as { note: Note };
        note = uploadData.note;
      }
      setNotes((prev) => [note, ...prev]);
      setDraft("");
      setPendingFiles([]);
      setComposerOpen(false);
    } catch (error) {
      console.error(error);
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setSaveFailed(false);
    try {
      const response = await http
        .put(`/notes/${editingId}`, { json: { content: editText } })
        .json<{ note: Note }>();
      setNotes((prev) => prev.map((note) => (note.id === editingId ? response.note : note)));
      cancelEdit();
    } catch (error) {
      console.error(error);
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (note: Note) => {
    setSaving(true);
    setSaveFailed(false);
    try {
      await http.delete(`/notes/${note.id}`).json();
      setNotes((prev) => prev.filter((item) => item.id !== note.id));
    } catch (error) {
      console.error(error);
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PageHeader
          title={project?.name ?? "Project"}
          context="Notes"
          action={
            <button
              type="button"
              aria-label={composerOpen ? "Close note composer" : "Add note"}
              onClick={handleToggleComposer}
              className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200/50 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-300"
            >
              {composerOpen ? (
                <IconX size={15} stroke={1.75} aria-hidden="true" />
              ) : (
                <IconPlus size={15} stroke={1.75} aria-hidden="true" />
              )}
            </button>
          }
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <p className="text-[13px] text-neutral-400 dark:text-neutral-500">Loading notes…</p>
          ) : notes.length > 0 ? (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/40"
                >
                  {editingId === note.id ? (
                    <div className="p-3">
                      <textarea
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        rows={Math.max(3, editText.split("\n").length)}
                        className={inputBaseClass}
                        autoFocus
                      />
                      <div className="mt-2 flex gap-1">
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          disabled={saving}
                          className="shrink-0 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-accent-600 transition-colors hover:bg-accent-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-accent-300 dark:hover:bg-accent-950"
                        >
                          Save
                        </button>
                        <button type="button" onClick={cancelEdit} className={subtleButtonClass}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group p-3">
                      <div className="space-y-1.5">{renderNoteBody(note)}</div>
                      <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => startEdit(note)}
                          className={subtleButtonClass}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note)}
                          disabled={saving}
                          className={subtleButtonClass}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-neutral-400 dark:text-neutral-500">
              No notes yet — press + to add the first one.
            </p>
          )}
        </div>

        {composerOpen ? (
          <div className="shrink-0 border-t border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <textarea
              ref={composerTextareaRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setDraft("");
                  setPendingFiles([]);
                  setComposerOpen(false);
                }
              }}
              placeholder="Write a new note…"
              rows={3}
              autoFocus
              className={inputBaseClass}
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(event) => handleAttachFiles(event.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 text-[12px] text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-200"
              >
                <IconPaperclip size={13} stroke={1.75} aria-hidden="true" />
                Attach file
              </button>
              {pendingFiles.map((file, index) => (
                <span
                  key={`${file.name}-${index}`}
                  className="flex min-w-0 items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-[12px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => removePendingFile(index)}
                    className="grid size-4 shrink-0 cursor-pointer place-items-center rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    <IconX size={12} stroke={1.75} aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
              {saving ? (
                <span className="mr-auto text-[12px] text-neutral-400 dark:text-neutral-500">
                  Saving…
                </span>
              ) : null}
              {saveFailed ? (
                <span className="mr-auto text-[12px] text-red-500 dark:text-red-400">
                  Failed to save note
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  setPendingFiles([]);
                  setComposerOpen(false);
                }}
                className={subtleButtonClass}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNote}
                disabled={
                  saving ||
                  !projectId ||
                  (draft.trim().length === 0 && pendingFiles.length === 0)
                }
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Add note
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <NotesRail linkedItems={linkedItems} />
    </div>
  );
}