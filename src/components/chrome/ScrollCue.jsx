export function ScrollCue() {
  return (
    <a
      href="#stratosphere"
      className="focus-ring group mt-10 inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.22em] no-underline"
      style={{ color: 'var(--ink-muted)' }}
    >
      <span className="scroll-cue-dot inline-block h-8 w-px bg-current" />
      Ascend
    </a>
  );
}
