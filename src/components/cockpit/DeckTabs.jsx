import { TABS } from '../../data/modes';

const ITEMS = [
  { id: TABS.PROJECTS, label: 'Projects' },
  { id: TABS.EXPERIENCE, label: 'Experience' },
];

export function DeckTabs({ tab, counts, onChange }) {
  function onKeyDown(event) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    event.stopPropagation();
    const next = tab === TABS.PROJECTS ? TABS.EXPERIENCE : TABS.PROJECTS;
    onChange(next);
    document.getElementById(`deck-tab-${next}`)?.focus();
  }

  return (
    <div className="relative grid grid-cols-2 p-[3px]" role="tablist" aria-label="Cockpit content" onKeyDown={onKeyDown}>
      <span
        className="seg-indicator"
        style={{ transform: tab === TABS.EXPERIENCE ? 'translateX(100%)' : 'translateX(0)' }}
        aria-hidden="true"
      />
      {ITEMS.map((item) => {
        const selected = tab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`deck-tab-${item.id}`}
            aria-controls={`deck-panel-${item.id}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className="focus-ring relative z-[1] flex items-center justify-center gap-2 rounded-full px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition"
            style={{ color: 'var(--ink)', opacity: selected ? 1 : 0.62 }}
            onClick={() => onChange(item.id)}
          >
            {item.label}
            <span className="opacity-60">{String(counts[item.id] ?? 0).padStart(2, '0')}</span>
          </button>
        );
      })}
    </div>
  );
}
