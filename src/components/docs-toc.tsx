type DocsTocProps = {
  sections: readonly { id: string; label: string }[];
};

export function DocsToc({ sections }: DocsTocProps) {
  if (!sections.length) {
    return null;
  }

  return (
    <aside className="sticky top-24 hidden h-fit xl:block">
      <p className="annotation text-[var(--color-muted)]">On this page</p>
      <nav className="mt-4 space-y-3">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="block text-sm leading-6 text-[var(--color-muted)] transition hover:text-white"
          >
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
