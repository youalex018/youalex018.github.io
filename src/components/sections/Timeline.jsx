export function Timeline({ items }) {
  return (
    <ol className="relative m-0 list-none border-l border-current/20 p-0 pl-6">
      {items.map((item) => (
        <li key={item.id} className="relative mb-4 last:mb-0">
          <span className="absolute top-5 -left-[1.7rem] h-2.5 w-2.5 rounded-full border border-current bg-current shadow-[0_0_12px_currentColor]" />
          <article className="glass rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="display m-0 text-2xl leading-tight font-medium" style={{ color: 'var(--ink)' }}>
                {item.role}
              </h3>
              <p className="m-0 font-mono text-[0.65rem] uppercase tracking-[0.2em]" style={{ color: 'var(--ink-muted)' }}>
                {item.date}
              </p>
            </div>
            <p className="mt-1 mb-0" style={{ color: 'var(--ink-muted)' }}>
              {item.org}
            </p>
            <ul className="mt-4 mb-0 list-disc space-y-2 pl-4 text-[0.98rem] leading-relaxed" style={{ color: 'var(--ink)' }}>
              {item.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        </li>
      ))}
    </ol>
  );
}
