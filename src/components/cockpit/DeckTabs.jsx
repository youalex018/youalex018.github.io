import { TABS } from '../../data/modes';

function ExperienceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M8 5.5v13" />
      <circle cx="8" cy="6" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="8" cy="12" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="8" cy="18" r="1.35" fill="currentColor" stroke="none" />
      <path d="M11.5 6H18" />
      <path d="M11.5 12H18" />
      <path d="M11.5 18H16" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="8" width="12" height="12" rx="1.8" />
      <path d="M8.5 8V5.8A1.8 1.8 0 0 1 10.3 4H18.7A1.8 1.8 0 0 1 20.5 5.8V15.2A1.8 1.8 0 0 1 18.7 17H15.5" />
    </svg>
  );
}

const ITEMS = [
  { id: TABS.EXPERIENCE, label: 'Experience', Icon: ExperienceIcon },
  { id: TABS.PROJECTS, label: 'Projects', Icon: ProjectsIcon },
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
    <div className="mode-toggle glass relative inline-grid max-w-full justify-self-start" role="tablist" aria-label="Cockpit content" onKeyDown={onKeyDown}>
      <span
        className="seg-indicator"
        style={{ transform: tab === TABS.PROJECTS ? 'translateX(100%)' : 'translateX(0)' }}
        aria-hidden="true"
      />
      {ITEMS.map((item) => {
        const selected = tab === item.id;
        const Icon = item.Icon;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`deck-tab-${item.id}`}
            aria-controls={`deck-panel-${item.id}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className="focus-ring mode-toggle-btn"
            onClick={() => onChange(item.id)}
          >
            <Icon />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
