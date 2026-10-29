import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GitHubIcon } from '../chrome/SocialIcons';
import { Badge } from '../ui/Badge';
import { ProjectPreview } from '../ui/ProjectPreview';

const REVEAL_MS = 300;

function RingGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.4" transform="rotate(-10 12 12)" opacity="0.6" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      className="deck-project-chevron"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function revealInList(row, behavior) {
  const list = row.closest('.deck-list');
  if (!list) return;
  const listBox = list.getBoundingClientRect();
  const rowBox = row.getBoundingClientRect();
  if (rowBox.bottom > listBox.bottom) {
    const top = Math.min(rowBox.bottom - listBox.bottom + 12, rowBox.top - listBox.top);
    list.scrollBy({ top, behavior });
  } else if (rowBox.top < listBox.top) {
    list.scrollBy({ top: rowBox.top - listBox.top - 4, behavior });
  }
}

export function ProjectRow({ item, open, onToggle }) {
  const rowRef = useRef(null);
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(open);
  if (open && !seen) setSeen(true);

  useEffect(() => {
    if (!open) return undefined;
    const id = window.setTimeout(() => {
      if (rowRef.current) revealInList(rowRef.current, reduced ? 'auto' : 'smooth');
    }, reduced ? 0 : REVEAL_MS);
    return () => window.clearTimeout(id);
  }, [open, reduced]);

  const meta = [item.secondary, item.eyebrow].filter(Boolean).join(' · ');
  const headId = `project-head-${item.id}`;
  const titleId = `project-title-${item.id}`;
  const panelId = `project-panel-${item.id}`;
  const outcome = item.bullets[0];

  return (
    <article ref={rowRef} className={`deck-project${open ? ' is-open' : ''}`}>
      <h3 className="m-0 font-normal">
        <button
          type="button"
          id={headId}
          className="deck-project-head focus-ring"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="deck-project-body">
            <span id={titleId} className="display deck-project-title">
              {item.headline}
            </span>
            {meta ? <span className="deck-meta">{meta}</span> : null}
            {item.description ? <span className="deck-project-teaser">{item.description}</span> : null}
          </span>
          <span className="deck-project-aside" aria-hidden="true">
            {item.image ? (
              <img
                className="deck-project-thumb"
                src={item.image}
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
                style={{ objectPosition: item.imagePosition }}
              />
            ) : (
              <span className="deck-project-thumb deck-project-glyph">
                <RingGlyph />
              </span>
            )}
            <Chevron />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={titleId}
        className="deck-project-panel"
        inert={!open || undefined}
      >
        <div className="deck-project-panel-inner">
          {seen ? (
            <div className="deck-project-detail">
              {item.image ? (
                <ProjectPreview
                  image={item.image}
                  imageAlt={item.imageAlt}
                  video={item.video}
                  objectPosition={item.imagePosition}
                />
              ) : null}

              {outcome ? (
                <div className="deck-project-outcome">
                  <p className="deck-project-label">Outcome</p>
                  <p className="m-0 text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                    {outcome}
                  </p>
                </div>
              ) : null}

              {item.tags.length ? (
                <ul className="mt-4 mb-0 flex list-none flex-wrap gap-2 p-0" aria-label="Tech stack">
                  {item.tags.map((tag) => (
                    <li key={tag}>
                      <Badge>{tag}</Badge>
                    </li>
                  ))}
                </ul>
              ) : null}

              {item.links.length ? (
                <div className="mt-4 flex flex-wrap gap-4 font-mono text-[0.68rem] uppercase tracking-[0.16em]">
                  {item.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="deck-project-link focus-ring inline-flex items-center gap-1.5"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.icon === 'github' ? <GitHubIcon size={14} /> : null}
                      {link.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
