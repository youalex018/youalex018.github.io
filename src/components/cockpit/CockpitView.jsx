import { CockpitHero } from './CockpitHero';
import { CockpitStatusStrip } from './CockpitStatusStrip';
import { ContentDeck } from './ContentDeck';

export function CockpitView({ className = '', inert: isInert = false }) {
  return (
    <div
      className={`cockpit-shell ${className}`}
      data-theme="dark"
      inert={isInert || undefined}
    >
      <div className="cockpit-stagger mx-auto grid h-full min-h-0 w-full max-w-7xl min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] md:grid-rows-1 md:gap-6 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-8">
        <CockpitHero />
        <ContentDeck />
      </div>
      <CockpitStatusStrip />
    </div>
  );
}
