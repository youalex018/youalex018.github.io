export function Section({ id, theme, children, className = '' }) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={`relative z-10 min-h-[100svh] px-5 py-24 sm:px-10 md:px-12 md:py-28 md:pr-44 ${className}`}
      style={{ color: 'var(--ink)' }}
    >
      {children}
    </section>
  );
}
