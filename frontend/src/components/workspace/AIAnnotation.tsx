import MarkdownContent from "./MarkdownContent";

interface AIAnnotationProps {
  content: string;
}

export default function AIAnnotation({ content }: AIAnnotationProps) {
  return (
    <section className="flex items-start gap-3">
      <span className="mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-950 dark:text-accent-300">
        <svg viewBox="0 0 24 24" className="size-3" fill="currentColor" aria-hidden="true">
          <path d="M12 3c.5 3.8 2.2 5.5 6 6-3.8.5-5.5 2.2-6 6-.5-3.8-2.2-5.5-6-6 3.8-.5 5.5-2.2 6-6Z" />
        </svg>
      </span>
      <MarkdownContent content={content} className="max-w-[65ch]" />
    </section>
  );
}