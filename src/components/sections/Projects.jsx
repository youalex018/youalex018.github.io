import { projects } from '../../data/content';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { ProjectCard } from './ProjectCard';

export function Projects() {
  const [featured, ...rest] = projects.items;

  return (
    <Section id="mesosphere" theme="dark" className="flex flex-col justify-center">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="m-0 font-mono text-[0.68rem] uppercase tracking-[0.28em]" style={{ color: 'var(--ink-muted)' }}>
            Mesosphere
          </p>
          <h2
            className="display mt-3 mb-10 max-w-[14ch] text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.94] font-medium"
            style={{ color: 'var(--ink)' }}
          >
            Projects
          </h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="md:col-span-2">
            <ProjectCard project={featured} featured />
          </Reveal>
          {rest.map((project, index) => (
            <Reveal key={project.id} delay={80 + index * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
