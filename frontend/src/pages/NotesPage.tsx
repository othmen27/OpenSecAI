import { useState } from "react";
import { IconPlus, IconX } from "@tabler/icons-react";
import PageHeader from "../components/workspace/PageHeader";
import NotesRail, { type LinkedItem } from "./NotesRail";
import { useWorkspaceContext } from "../components/workspace/WorkspaceContext";
import { useProjects } from "../providers/ProjectsProvider";

const inputBaseClass =
  "w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-[13px] leading-relaxed text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-accent-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300 dark:placeholder:text-neutral-500";

const subtleButtonClass =
  "shrink-0 rounded-md px-2.5 py-1.5 text-[12px] text-neutral-400 transition-colors hover:bg-neutral-200/50 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-300";

export default function NotesPage() {
  const { project } = useWorkspaceContext();
  const { updateProject } = useProjects();

  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const notes = project?.notes ?? [];

  const linkedItems: LinkedItem[] = (project?.files ?? []).map((file, index) => ({
    id: `file-${index}`,
    kind: "report",
    label: file,
  }));

  const persistNotes = async (next: string[]): Promise<boolean> => {
    if (!project) return false;
    setSaving(true);
    setSaveFailed(false);
    try {
      await updateProject(project.id, { notes: next });
      return true;
    } catch (error) {
      console.error(error);
      setSaveFailed(true);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComposer = () => {
    setComposerOpen((open) => !open);
  };

  const handleAddNote = async () => {
    const text = draft.trim();
    if (!text) return;
    const ok = await persistNotes([...notes, text]);
    if (ok) {
      setDraft("");
      setComposerOpen(false);
    }
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(notes[index]);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const handleSaveEdit = async (index: number) => {
    const next = [...notes];
    next[index] = editText;
    const ok = await persistNotes(next);
    if (ok) cancelEdit();
  };

  const handleDeleteNote = async (index: number) => {
    await persistNotes(notes.filter((_, i) => i !== index));
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
          {notes.length > 0 ? (
            <ul className="space-y-2">
              {notes.map((note, index) => (
                <li
                  key={index}
                  className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/40"
                >
                  {editingIndex === index ? (
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
                          onClick={() => handleSaveEdit(index)}
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
                      <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                        {note}
                      </p>
                      <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => startEdit(index)}
                          className={subtleButtonClass}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(index)}
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
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setDraft("");
                  setComposerOpen(false);
                }
              }}
              placeholder="Write a new note…"
              rows={3}
              autoFocus
              className={inputBaseClass}
            />
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
                  setComposerOpen(false);
                }}
                className={subtleButtonClass}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNote}
                disabled={saving || draft.trim().length === 0}
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