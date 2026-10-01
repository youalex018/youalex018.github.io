import { CockpitHero } from './CockpitHero';
import { ContentDeck } from './ContentDeck';

export function CockpitView({ className = '', inert: isInert = false }) {
  return (
    <div
      className={`cockpit-shell ${className}`}
      data-theme="dark"
      inert={isInert || undefined}
    >
      <div className="cockpit-stagger grid h-full min-h-0 w-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-4 md:grid-cols-2 md:grid-rows-1 md:gap-x-8">
        <CockpitHero />
        <ContentDeck />
      </div>
    </div>
  );
}
