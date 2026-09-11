import timeline from '../../data/timeline.json';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { Timeline } from './Timeline';

export function Experience() {
  return (
    <Section id="thermosphere" theme="dark" className="flex flex-col justify-center">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <p className="m-0 font-mono text-[0.68rem] uppercase tracking-[0.28em]" style={{ color: 'var(--ink-muted)' }}>
            Thermosphere
          </p>
          <h2
            className="display mt-3 mb-4 max-w-[11ch] text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.94] font-medium"
            style={{ color: 'var(--ink)' }}
          >
            Experience
          </h2>
          <p className="m-0 max-w-[36ch] leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
            Internships and student teams across software, firmware, and hardware.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <Timeline items={timeline.items} />
        </Reveal>
      </div>
    </Section>
  );
}
