export function ScrollCue() {
  return (
    <a
      href="#stratosphere"
      data-range="-1 0.04"
      className="scroll-cue progress-sink focus-ring mb-8 inline-flex items-center gap-3 text-[0.85rem] no-underline"
      style={{ color: 'var(--ink-muted)' }}
    >
      <span className="scroll-cue-track relative inline-block h-8 w-3" aria-hidden="true">
        <span className="absolute top-1.5 bottom-0 left-1/2 w-px -translate-x-1/2 bg-current" />
        <span className="scroll-cue-rise absolute inset-x-0 top-0 flex justify-center">
          <svg viewBox="0 0 12 14" width="12" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 13V1" />
            <path d="M1 6 6 1l5 5" />
          </svg>
        </span>
      </span>
      <span className="scroll-cue-fine">Scroll up to ascend</span>
      <span className="scroll-cue-coarse">Swipe down to ascend</span>
    </a>
  );
}
