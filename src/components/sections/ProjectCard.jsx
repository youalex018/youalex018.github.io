import { Badge } from '../ui/Badge';
import { GlassPanel } from '../ui/GlassPanel';

export function ProjectCard({ project, featured = false }) {
  return (
    <GlassPanel
      as="article"
      className={`starlight-glow p-6 transition duration-500 sm:p-8 ${featured ? 'md:col-span-2 md:grid md:grid-cols-[1.2fr_0.8fr] md:gap-10' : ''}`}
    >
      <div>
        <p className="m-0 font-mono text-[0.65rem] uppercase tracking-[0.22em]" style={{ color: 'var(--ink-muted)' }}>
          {project.year} · {project.kicker}
        </p>
        <h3
          className="display mt-3 mb-0 text-[clamp(1.8rem,4vw,3rem)] leading-none font-medium"
          style={{ color: 'var(--ink)' }}
        >
          {project.title}
        </h3>
        <p className="mt-4 mb-0 max-w-[48ch] leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
          {project.summary}
        </p>
      </div>
      <div className={featured ? 'md:self-end' : 'mt-6'}>
        <p className="m-0 text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
          {project.impact}
        </p>
        <ul className="mt-4 mb-0 flex list-none flex-wrap gap-2 p-0">
          {project.tech.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>
        {(project.demoUrl || project.repoUrl) ? (
          <div className="mt-6 flex flex-wrap gap-4 font-mono text-[0.7rem] uppercase tracking-[0.16em]">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                className="focus-ring"
                style={{ color: 'var(--ink)' }}
                target="_blank"
                rel="noreferrer"
              >
                Live demo
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                className="focus-ring"
                style={{ color: 'var(--ink-muted)' }}
                target="_blank"
                rel="noreferrer"
              >
                Repository
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </GlassPanel>
  );
}
