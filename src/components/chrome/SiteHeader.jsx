import { CloudLogo } from './CloudLogo';
import { ModeToggle } from './ModeToggle';
import { SocialLinks } from './SocialIcons';
import { MODES } from '../../data/modes';
import { useActiveLayer } from '../../hooks/useActiveLayer';
import { useViewMode } from '../../state/ViewModeContext';
import socials from '../../data/socials.json';

const LINKS = [
  { id: 'troposphere', label: 'Alex You' },
  { id: 'stratosphere', label: 'About me' },
  { id: 'thermosphere', label: 'Experience' },
  { id: 'mesosphere', label: 'Projects' },
];

export function SiteHeader() {
  const active = useActiveLayer();
  const { mode, navigate } = useViewMode();
  const inOrbit = mode === MODES.ORBIT;

  if (inOrbit) {
    return (
      <header className="pointer-events-none fixed top-0 right-0 left-0 z-40">
        <div className="pointer-events-auto flex justify-end px-4 py-4 sm:px-6">
          <ModeToggle />
        </div>
      </header>
    );
  }

  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-40">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-4 sm:px-6 md:pr-44"
        style={{
          color: 'var(--chrome-ink)',
          textShadow: '0 1px 8px rgb(255 255 255 / 0.4), 0 1px 10px rgb(3 7 18 / 0.3)',
        }}
      >
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => navigate('troposphere')}
            className="focus-ring mr-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0"
            style={{ color: 'var(--chrome-ink)' }}
            aria-label="Alex You — home"
          >
            <CloudLogo size={28} />
          </button>
          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
            {LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => navigate(link.id)}
                  className={`focus-ring rounded-full border-0 bg-transparent px-2.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition sm:px-3.5 sm:text-[0.68rem] ${
                    isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ color: 'var(--chrome-ink)' }}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <ModeToggle />
          </div>
          <SocialLinks items={socials.items} />
        </div>
      </nav>
    </header>
  );
}
