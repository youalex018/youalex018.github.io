import { CloudLogo } from './CloudLogo';
import { useActiveLayer } from '../../hooks/useActiveLayer';
import { jumpTo } from '../../lib/jump';
import socials from '../../data/socials.json';

const LINKS = [
  { id: 'stratosphere', label: 'About me' },
  { id: 'thermosphere', label: 'Experience' },
  { id: 'mesosphere', label: 'Projects' },
];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7.5 12 13l8-5.5" />
    </svg>
  );
}

const ICONS = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: MailIcon,
};

export function SiteHeader() {
  const active = useActiveLayer();

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
            onClick={() => jumpTo('troposphere')}
            className="focus-ring mr-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0"
            style={{ color: 'var(--chrome-ink)' }}
            aria-label="Alex You — home"
          >
            <CloudLogo size={28} />
          </button>
          {LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => jumpTo(link.id)}
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
        <div className="flex shrink-0 items-center gap-1 sm:gap-2" aria-label="Social links">
          {socials.items.map((item) => {
            const Icon = ICONS[item.id];
            if (!Icon) return null;
            const external = item.href.startsWith('http');
            return (
              <a
                key={item.id}
                href={item.href}
                className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full opacity-80 transition hover:opacity-100"
                style={{ color: 'var(--chrome-ink)' }}
                aria-label={item.label}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
