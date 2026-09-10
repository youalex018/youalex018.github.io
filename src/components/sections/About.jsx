import profile from '../../data/profile.json';
import { Badge } from '../ui/Badge';
import { GlassPanel } from '../ui/GlassPanel';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

function WeatherBalloon() {
  return (
    <svg
      className="balloon-rise h-40 w-24 text-sky-950/70 md:h-52 md:w-28"
      viewBox="0 0 80 160"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="40" cy="42" rx="26" ry="34" fill="url(#balloonFill)" stroke="currentColor" strokeWidth="1.2" />
      <path d="M28 70 L40 82 L52 70" fill="#fff7ed" stroke="currentColor" strokeWidth="1" />
      <path d="M40 82 V118" stroke="currentColor" strokeWidth="1" />
      <rect x="30" y="118" width="20" height="12" rx="1.5" fill="#fff7ed" stroke="currentColor" strokeWidth="1" />
      <circle cx="32" cy="30" r="6" fill="white" fillOpacity="0.35" />
      <defs>
        <linearGradient id="balloonFill" x1="20" y1="8" x2="64" y2="78">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function About() {
  return (
    <Section id="stratosphere" theme="light" className="flex flex-col justify-center">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <p className="m-0 font-mono text-[0.68rem] uppercase tracking-[0.28em]" style={{ color: 'var(--ink-muted)' }}>
            Stratosphere · About
          </p>
          <h2
            className="display mt-3 mb-0 max-w-[12ch] text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.94] font-medium"
            style={{ color: 'var(--ink)' }}
          >
            {profile.philosophy.lede}
          </h2>
          <div className="mt-8 hidden lg:block">
            <WeatherBalloon />
          </div>
        </Reveal>

        <div className="grid gap-5">
          <Reveal delay={80}>
            <GlassPanel className="p-6 sm:p-8">
              <p className="m-0 text-[1.05rem] leading-relaxed" style={{ color: 'var(--ink)' }}>
                {profile.philosophy.body}
              </p>
              <p className="mt-5 mb-0 leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                {profile.background}
              </p>
              <p className="display mt-6 mb-0 text-xl italic" style={{ color: 'var(--ink)' }}>
                {profile.philosophy.drive}
              </p>
            </GlassPanel>
          </Reveal>
          <Reveal delay={160}>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Core skill stack">
              {profile.skills.map((skill) => (
                <li key={skill}>
                  <Badge>{skill}</Badge>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
