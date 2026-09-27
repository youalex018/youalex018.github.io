import { profile } from '../../data/content';
import { ScrollCue } from '../chrome/ScrollCue';
import { Drift } from '../ui/Drift';
import { Section } from '../ui/Section';

export function Hero() {
  return (
    <Section id="troposphere" theme="light" className="flex flex-col justify-center pb-28 md:pb-24">
      <div className="max-w-6xl">
        <Drift>
          <ScrollCue />
          <h1
            className="display m-0 max-w-[11ch] text-[clamp(3.6rem,13vw,9rem)] leading-[0.86] font-medium tracking-[-0.03em]"
            style={{ color: 'var(--ink)' }}
          >
            {profile.name}
          </h1>
          <p
            className="display mt-6 mb-0 max-w-[28ch] text-[clamp(1.35rem,3vw,2.2rem)] italic leading-snug"
            style={{ color: 'var(--ink)' }}
          >
            {profile.title}
          </p>
        </Drift>
      </div>
    </Section>
  );
}
