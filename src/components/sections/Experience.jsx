import { timeline } from '../../data/content';
import { Drift } from '../ui/Drift';
import { Section } from '../ui/Section';
import { Timeline } from './Timeline';

export function Experience() {
  return (
    <Section id="thermosphere" theme="dark" className="flex flex-col justify-center">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Drift>
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
        </Drift>
        <Drift>
          <Timeline items={timeline.items} />
        </Drift>
      </div>
    </Section>
  );
}
