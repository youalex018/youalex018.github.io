export function Badge({ children }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em]"
      style={{
        color: 'var(--ink)',
        borderColor: 'color-mix(in oklab, var(--ink) 22%, transparent)',
        background: 'color-mix(in oklab, var(--panel) 70%, transparent)',
      }}
    >
      {children}
    </span>
  );
}
