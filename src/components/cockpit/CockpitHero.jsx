import profile from '../../data/profile.json';
import socials from '../../data/socials.json';
import { ResumeIcon, SocialLinks } from '../chrome/SocialIcons';
import { Badge } from '../ui/Badge';

const MAX_SKILLS = 6;

export function CockpitHero() {
  const extraSkills = Math.max(0, profile.skills.length - MAX_SKILLS);
  const body = profile.philosophy?.body;

  return (
    <section
      id="cockpit-hero"
      tabIndex={-1}
      className="flex min-h-0 min-w-0 flex-col justify-center overflow-hidden outline-none md:-translate-y-[8%]"
      aria-label="Introduction"
    >
      <h1
        className="display m-0 text-[clamp(2rem,9vw,3rem)] leading-[0.9] font-medium lg:text-[clamp(2.4rem,6vmin,5rem)]"
        style={{ color: 'var(--ink)' }}
      >
        {profile.name}
      </h1>
      <p
        className="display mt-3 mb-0 line-clamp-2 text-[clamp(0.95rem,2.4vmin,1.35rem)] italic leading-snug"
        style={{ color: 'var(--ink)' }}
      >
        {profile.title}
      </p>
      {body ? (
        <p className="cockpit-bio mt-3 mb-0 line-clamp-3 text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
          {body}
        </p>
      ) : null}

      <ul className="cockpit-skills mt-4 mb-0 flex list-none flex-wrap gap-2 p-0" aria-label="Core skill stack">
        {profile.skills.slice(0, MAX_SKILLS).map((skill) => (
          <li key={skill}>
            <Badge>{skill}</Badge>
          </li>
        ))}
        {extraSkills > 0 ? (
          <li>
            <Badge>+{extraSkills}</Badge>
          </li>
        ) : null}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SocialLinks items={socials.items} />
        <a
          href={profile.resumeUrl}
          className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full opacity-80 no-underline transition hover:opacity-100"
          style={{ color: 'var(--chrome-ink)' }}
          aria-label="Resume"
          download
        >
          <ResumeIcon />
        </a>
      </div>
    </section>
  );
}
