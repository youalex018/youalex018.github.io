import { useRef, useState } from 'react';
import { GitHubIcon } from '../chrome/SocialIcons';
import { Badge } from '../ui/Badge';

function isCoarsePointer() {
  return window.matchMedia('(hover: none)').matches;
}

export function DeckCard({ item }) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

  if (!item) return null;

  const teaser = item.body || item.bullets[0] || '';

  function openFine() {
    if (!isCoarsePointer()) setOpen(true);
  }

  function closeFine() {
    if (!isCoarsePointer()) setOpen(false);
  }

  return (
    <article
      ref={rootRef}
      className={`deck-item glass starlight-glow rounded-2xl p-4 sm:p-5 ${open ? 'is-open' : ''}`}
      aria-expanded={open}
      onMouseEnter={openFine}
      onMouseLeave={closeFine}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) closeFine();
      }}
      onClick={(event) => {
        if (event.target.closest('a')) return;
        if (isCoarsePointer()) setOpen((value) => !value);
      }}
    >
      <p className="m-0 font-mono text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: 'var(--ink-muted)' }}>
        {item.eyebrow}
      </p>
      <h3
        className="display mt-2 mb-0 text-[clamp(1.15rem,2.6vmin,1.7rem)] leading-[1.12] font-medium"
        style={{ color: 'var(--ink)' }}
      >
        {item.title}
      </h3>
      {item.subtitle ? (
        <p className="mt-1 mb-0 text-sm" style={{ color: 'var(--ink-muted)' }}>
          {item.subtitle}
        </p>
      ) : null}
      {teaser ? (
        <p className="deck-item-teaser mt-3 mb-0 line-clamp-1 text-[0.92rem] leading-relaxed" style={{ color: 'var(--ink)' }}>
          {teaser}
        </p>
      ) : null}

      <div className={`deck-item-detail ${open ? 'is-open' : ''}`}>
        <div className="deck-item-detail-inner">
          <div className={item.image ? 'mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,11rem)] md:items-start' : 'mt-3'}>
            <div>
              {item.body ? (
                <p className="mt-0 mb-0 text-[0.95rem] leading-relaxed" style={{ color: 'var(--ink)' }}>
                  {item.body}
                </p>
              ) : null}
              {item.bullets.length ? (
                <ul
                  className={`mb-0 list-disc space-y-1.5 pl-4 text-[0.92rem] leading-relaxed ${item.body ? 'mt-3' : 'mt-0'}`}
                  style={{ color: 'var(--ink)' }}
                >
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            {item.image ? (
              <img
                src={item.image}
                alt=""
                className="aspect-[16/10] w-full rounded-xl object-cover"
              />
            ) : null}
          </div>
        </div>
      </div>

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
