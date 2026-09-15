export function GitHubIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function LinkedInIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function MailIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7.5 12 13l8-5.5" />
    </svg>
  );
}

export function ResumeIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3.5h7.2L20 9.2V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1.5-1.5z" />
      <path d="M14 3.5V9h6" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

export const SOCIAL_ICONS = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: MailIcon,
};

export function SocialLinks({ items, className = '' }) {
  return (
    <div className={`flex shrink-0 items-center gap-1 sm:gap-2 ${className}`} aria-label="Social links">
      {items.map((item) => {
        const Icon = SOCIAL_ICONS[item.id];
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
  );
}
