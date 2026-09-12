import { MODES } from '../../data/modes';
import { useViewMode } from '../../state/ViewModeContext';

function AscentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V7" />
      <path d="M7 12 12 7l5 5" />
      <path d="M6 19h12" />
    </svg>
  );
}

function OrbitIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <ellipse cx="12" cy="12" rx="9" ry="4.2" transform="rotate(-24 12 12)" />
      <circle cx="19.2" cy="8.2" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ModeToggle({ compact = false, className = '' }) {
  const { mode, setMode } = useViewMode();
  const orbit = mode === MODES.ORBIT;

  return (
    <div
      role="group"
      aria-label="View mode"
      data-theme={orbit ? 'dark' : 'light'}
      className={`mode-toggle glass inline-grid ${compact ? 'mode-toggle-compact' : ''} ${className}`}
    >
      <span
        className="seg-indicator"
        style={{ transform: orbit ? 'translateX(100%)' : 'translateX(0)' }}
        aria-hidden="true"
      />
      <button
        type="button"
        className="focus-ring mode-toggle-btn"
        aria-pressed={mode === MODES.ASCENT}
        aria-label="Full Ascent"
        onClick={() => void setMode(MODES.ASCENT)}
      >
        <AscentIcon />
        {compact ? null : <span>Ascent</span>}
      </button>
      <button
        type="button"
        className="focus-ring mode-toggle-btn"
        aria-pressed={mode === MODES.ORBIT}
        aria-label="Orbit compact view"
        onClick={() => void setMode(MODES.ORBIT)}
      >
        <OrbitIcon />
        {compact ? null : <span>Orbit</span>}
      </button>
    </div>
  );
}
