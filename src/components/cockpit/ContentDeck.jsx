import { useMemo } from 'react';
import { TABS } from '../../data/modes';
import { projects, timeline } from '../../data/content';
import { projectsToDeck, timelineToDeck } from '../../lib/deck';
import { useViewMode } from '../../state/ViewModeContext';
import { DeckCard } from './DeckCard';
import { DeckTabs } from './DeckTabs';

export function ContentDeck() {
  const { tab, setTab } = useViewMode();

  const decks = useMemo(
    () => ({
      [TABS.PROJECTS]: projectsToDeck(projects.items),
      [TABS.EXPERIENCE]: timelineToDeck(timeline.items),
    }),
    [],
  );

  const items = decks[tab];

  return (
    <section
      id="cockpit-deck"
      tabIndex={-1}
      className="deck-shell focus-ring grid h-full min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] outline-none"
      aria-label="Projects and experience deck"
    >
      <DeckTabs tab={tab} onChange={setTab} />
      <div
        id={`deck-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`deck-tab-${tab}`}
        className="deck-list deck-mask scroll-rail mt-2 min-h-0 min-w-0 overflow-y-auto overscroll-contain pr-1"
      >
        <ul className="m-0 flex list-none flex-col divide-y divide-current/10 p-0">
          {items.map((item) => (
            <li key={item.id}>
              <DeckCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
