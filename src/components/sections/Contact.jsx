import profile from '../../data/profile.json';
import socials from '../../data/socials.json';
import { GlassPanel } from '../ui/GlassPanel';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { Constellation } from './Constellation';

export function Contact() {
  return (
    <Section id="exosphere" theme="dark" className="flex flex-col justify-center pb-28 md:pb-24">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <p className="m-0 font-mono text-[0.68rem] uppercase tracking-[0.28em]" style={{ color: 'var(--ink-muted)' }}>
            Exosphere · Contact
          </p>
          <h2
            className="display mt-3 mb-4 max-w-[12ch] text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.94] font-medium"
            style={{ color: 'var(--ink)' }}
          >
            Reach out
          </h2>
          <p className="mb-8 max-w-[40ch] leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
            Always down to discuss anything or just chat 👇
          </p>
          <GlassPanel className="grid gap-3 p-6 sm:p-8">
            {profile.emails.map((item) => (
              <a
                key={item.address}
                href={`mailto:${item.address}`}
                className="btn-ghost focus-ring starlight-glow flex items-center justify-between gap-4 rounded-2xl px-4 py-3 no-underline"
              >
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-muted)' }}>
                  {item.label}
                </span>
                <span className="text-[0.95rem]" style={{ color: 'var(--ink)' }}>
                  {item.address}
                </span>
              </a>
            ))}
          </GlassPanel>
        </Reveal>

        <Reveal delay={120} className="flex flex-col gap-6">
          <Constellation />
          <div className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-[0.72rem] uppercase tracking-[0.16em]">
            {socials.items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="focus-ring"
                style={{ color: 'var(--ink)' }}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
          <p
            className="escape-banner mt-auto mb-0 font-mono text-[0.68rem] uppercase tracking-[0.22em]"
            style={{ color: 'var(--ink)' }}
          >
            Escape velocity reached
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
