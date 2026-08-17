import { useState } from "react";
import RightRail, { RailSection, railEmptyTextClass } from "../components/workspace/RightRail";

/** Minimal shape of a request shown in the center list + preview. */
export interface PreviewRequest {
  method: string;
  path: string;
  status: number;
}

interface HttpHistoryRailProps {
  preview: PreviewRequest | null;
  tags: string[];
  onTagSelect?: (tag: string) => void;
}


export default function HttpHistoryRail({ preview, tags, onTagSelect }: HttpHistoryRailProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <RightRail>
      <RailSection label="Filter by tag">
        {tags.length > 0 ? (
          <ul className="space-y-1">
            {tags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => {
                    const next = activeTag === tag ? null : tag;
                    setActiveTag(next);
                    onTagSelect?.(tag);
                  }}
                  className={`w-full rounded-md border px-2.5 py-1.5 text-left text-[12px] transition-colors ${
                    activeTag === tag
                      ? "border-neutral-400 bg-neutral-200/50 text-neutral-800 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-100"
                      : "border-neutral-200 text-neutral-500 hover:bg-neutral-200/40 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={railEmptyTextClass}>No tags yet</p>
        )}
      </RailSection>

      <RailSection label="Preview">
        {preview ? (
          <div className="flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5 dark:bg-neutral-800">
            <span className="w-10 shrink-0 font-mono text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
              {preview.method}
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-neutral-700 dark:text-neutral-300">
              {preview.path}
            </span>
            <span className="shrink-0 rounded-sm bg-neutral-200/70 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
              {preview.status}
            </span>
          </div>
        ) : (
          <p className={railEmptyTextClass}>Hover a request to preview it</p>
        )}
      </RailSection>
    </RightRail>
  );
}