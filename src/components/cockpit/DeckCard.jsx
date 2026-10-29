import { ProjectRow } from './ProjectRow';

function ExperienceRow({ item }) {
  return (
    <article className="deck-experience">
      <h3 className="display deck-experience-org">{item.headline}</h3>
      {item.eyebrow ? <p className="deck-meta">{item.eyebrow}</p> : null}
      {item.secondary ? <p className="display deck-experience-role">{item.secondary}</p> : null}
      {item.description ? <p className="deck-experience-note">{item.description}</p> : null}
    </article>
  );
}

export function DeckCard({ item, open = false, onToggle }) {
  if (!item) return null;
  if (item.kind === 'experience') return <ExperienceRow item={item} />;
  return <ProjectRow item={item} open={open} onToggle={onToggle} />;
}
