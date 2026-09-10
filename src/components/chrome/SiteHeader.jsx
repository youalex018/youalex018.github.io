import { useActiveLayer } from '../../hooks/useActiveLayer';
import { jumpTo } from '../../lib/jump';

const LINKS = [
  { id: 'stratosphere', label: 'About me' },
  { id: 'thermosphere', label: 'Experience' },
  { id: 'mesosphere', label: 'Projects' },
];

export function SiteHeader() {
  const active = useActiveLayer();

  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-40">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-1 px-4 py-4 sm:gap-2 sm:px-6 md:pr-44"
        style={{
          color: 'var(--chrome-ink)',
          textShadow: '0 1px 8px rgb(255 255 255 / 0.4), 0 1px 10px rgb(3 7 18 / 0.3)',
        }}
      >
        {LINKS.map((link) => {
          const isActive = active === link.id;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => jumpTo(link.id)}
              className={`focus-ring rounded-full border-0 bg-transparent px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition sm:px-3.5 sm:text-[0.68rem] ${
                isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ color: 'var(--chrome-ink)' }}
              aria-current={isActive ? 'location' : undefined}
            >
              {link.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
