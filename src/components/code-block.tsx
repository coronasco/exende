import { CopyButton } from "@/components/copy-button";

type CodeBlockProps = {
  code: string;
  language: string;
  title?: string;
};

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  return (
    <div className="code-surface">
      <div className="flex items-center justify-between gap-4 border-b border-white/8 px-4 py-3">
        <div className="min-w-0">
          <p className="annotation text-[var(--color-muted)]">{language}</p>
          {title ? (
            <p className="mt-1 truncate font-mono text-[0.78rem] text-white/78">{title}</p>
          ) : null}
        </div>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.82rem] leading-7 text-[var(--color-foreground)] sm:px-5 sm:py-5">
        <code>{code}</code>
      </pre>
    </div>
  );
}
