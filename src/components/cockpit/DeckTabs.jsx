import { TABS } from '../../data/modes';

const ITEMS = [
  { id: TABS.EXPERIENCE, label: 'Experience' },
  { id: TABS.PROJECTS, label: 'Projects' },
];

export function DeckTabs({ tab, onChange }) {
  function onKeyDown(event) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    event.stopPropagation();
    const next = tab === TABS.PROJECTS ? TABS.EXPERIENCE : TABS.PROJECTS;
    onChange(next);
    document.getElementById(`deck-tab-${next}`)?.focus();
  }

  return (
    <div className="mode-toggle glass relative inline-grid max-w-full grid-cols-2 p-[2px]" role="tablist" aria-label="Cockpit content" onKeyDown={onKeyDown}>
      <span
        className="seg-indicator"
        style={{ transform: tab === TABS.PROJECTS ? 'translateX(100%)' : 'translateX(0)' }}
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
            className="focus-ring relative z-[1] flex items-center justify-center rounded-full px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] transition"
            style={{ color: 'var(--ink)', opacity: selected ? 1 : 0.62 }}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
