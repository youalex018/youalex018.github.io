import { GitHubIcon } from '../chrome/SocialIcons';
import { Badge } from '../ui/Badge';
import { ProjectPreview } from '../ui/ProjectPreview';

export function DeckCard({ item }) {
  if (!item) return null;

  return (
    <article className="deck-item py-4">
      {item.image ? (
        <ProjectPreview
          image={item.image}
          imageAlt={item.imageAlt}
          video={item.video}
          objectPosition={item.imagePosition}
          className="mb-3"
        />
      ) : null}
      {item.eyebrow ? (
        <p className="m-0 font-mono text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: 'var(--ink-muted)' }}>
          {item.eyebrow}
        </p>
      ) : null}
      <h3
        className="display mt-1.5 mb-0 text-[clamp(1.25rem,2.8vmin,1.85rem)] leading-[1.12] font-medium"
        style={{ color: 'var(--ink)' }}
      >
        {item.headline}
      </h3>
      {item.secondary ? (
        <p
          className="mt-1 mb-0 text-[clamp(0.95rem,2vmin,1.15rem)] leading-snug font-medium"
          style={{ color: 'var(--ink)' }}
        >
          {item.secondary}
        </p>
      ) : null}
      {item.description ? (
        <p
          className={`mt-2 mb-0 text-sm leading-relaxed ${item.kind === 'experience' ? 'line-clamp-1' : ''}`}
          style={{ color: 'var(--ink-muted)' }}
        >
          {item.description}
        </p>
      ) : null}

      {item.kind === 'project' && item.bullets.length ? (
        <ul className="mt-2 mb-0 list-disc space-y-1.5 pl-4 text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
          {item.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}

      {item.tags.length ? (
        <ul className="mt-3 mb-0 flex list-none flex-wrap gap-2 p-0">
          {item.tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {item.links.length ? (
        <div className="mt-3 flex flex-wrap gap-4 font-mono text-[0.68rem] uppercase tracking-[0.16em]">
          {item.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="focus-ring inline-flex items-center gap-1.5"
              style={{ color: 'var(--ink)' }}
              target="_blank"
              rel="noreferrer"
            >
              {link.icon === 'github' ? <GitHubIcon size={14} /> : null}
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
