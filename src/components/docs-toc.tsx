type DocsTocProps = {
  sections: readonly { id: string; label: string }[];
};

export function DocsToc({ sections }: DocsTocProps) {
  if (!sections.length) {
    return null;
  }

  return (
    <aside className="docs-toc">
      <p className="annotation text-[var(--color-muted)]">On this page</p>
      <nav className="mt-5 space-y-1">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
