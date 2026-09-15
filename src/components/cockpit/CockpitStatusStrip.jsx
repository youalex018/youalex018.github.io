import { COCKPIT_PROGRESS } from '../../data/modes';
import { formatAltitude, progressToAltitude } from '../../lib/altitude';

export function CockpitStatusStrip() {
  const altitude = formatAltitude(progressToAltitude(COCKPIT_PROGRESS));

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-muted)' }}>
      <p className="m-0 min-w-0 truncate">Orbit · {altitude}</p>
    </div>
  );
}
