import { useEffect, useRef } from 'react';
import { LAYERS } from '../../data/layers';
import { useActiveLayer } from '../../hooks/useActiveLayer';
import { formatAltitude, progressToAltitude } from '../../lib/altitude';
import { jumpTo } from '../../lib/jump';
import { ModeToggle } from './ModeToggle';

export function AltitudeMeter({ progressRef }) {
  const readoutRef = useRef(null);
  const mobileReadoutRef = useRef(null);
  const active = useActiveLayer();
  const activeLayer = LAYERS.find((layer) => layer.id === active) ?? LAYERS[0];

  useEffect(() => {
    let frame = 0;
    let lastText = '';
    const tick = () => {
      const text = formatAltitude(progressToAltitude(progressRef.current ?? 0));
      if (text !== lastText) {
        lastText = text;
        if (readoutRef.current) readoutRef.current.textContent = text;
        if (mobileReadoutRef.current) mobileReadoutRef.current.textContent = text;
      }
      if (!document.hidden) {
        frame = requestAnimationFrame(tick);
      }
    };
    const onVisibility = () => {
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [progressRef]);

  return (
    <>
      <nav
        aria-label="Atmospheric layers"
        className="pointer-events-none fixed top-0 right-0 z-30 hidden h-dvh w-40 flex-col items-end justify-between py-8 pr-4 md:flex"
        style={{ color: 'var(--chrome-ink)' }}
      >
        <div className="pointer-events-auto text-right font-mono text-[0.65rem] uppercase tracking-[0.22em] opacity-80">
          <p className="m-0" style={{ color: 'var(--chrome-muted)' }}>
            Altitude
          </p>
          <p ref={readoutRef} className="m-0 mt-1 text-sm tracking-normal">
            0.0 km
          </p>
        </div>

        <div className="relative h-[58vh] w-full">
          <div className="absolute top-0 right-1 bottom-0 w-px bg-current/25" />
          <span className="meter-needle pointer-events-none absolute right-1 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-current shadow-[0_0_12px_currentColor]" />
          <ol className="absolute inset-0 m-0 list-none p-0">
            {LAYERS.map((layer, index) => {
              const top = `${((LAYERS.length - 1 - index) / (LAYERS.length - 1)) * 100}%`;
              const isActive = layer.id === active;
              return (
                <li key={layer.id} className="absolute right-1 -translate-y-1/2" style={{ top }}>
                  <button
                    type="button"
                    onClick={() => jumpTo(layer.id)}
                    className="focus-ring pointer-events-auto group flex items-center gap-2 bg-transparent p-0"
                    aria-current={isActive ? 'location' : undefined}
                    aria-label={`Jump to ${layer.label}, ${layer.section}`}
                  >
                    <span
                      className={`w-[6.6rem] text-right font-mono text-[0.62rem] uppercase tracking-[0.14em] transition ${
                        isActive ? 'opacity-100' : 'opacity-45 group-hover:opacity-90'
                      }`}
                    >
                      {layer.label}
                    </span>
                    <span
                      className={`block h-2 w-2 rounded-full border border-current transition ${
                        isActive ? 'scale-125 bg-current' : 'bg-transparent'
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="pointer-events-none m-0 text-right font-mono text-[0.62rem] uppercase tracking-[0.18em] opacity-70">
          {activeLayer.section}
        </p>
      </nav>

      <nav
        aria-label="Atmospheric layers"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-current/15 px-4 py-2.5 backdrop-blur-md md:hidden"
        style={{
          color: 'var(--chrome-ink)',
          background: 'color-mix(in oklab, var(--panel, rgb(255 250 240 / 0.7)) 80%, transparent)',
        }}
      >
        <div className="mb-2 flex items-end justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.16em]">
          <span>{activeLayer.label}</span>
          <div className="flex items-center gap-2">
            <span ref={mobileReadoutRef}>0.0 km</span>
            <ModeToggle compact />
          </div>
        </div>
        <div className="relative mx-2 h-8">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current/30" />
          <span className="meter-needle-x absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
          {LAYERS.map((layer, index) => {
            const left = `${(index / (LAYERS.length - 1)) * 100}%`;
            const isActive = layer.id === active;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => jumpTo(layer.id)}
                className="focus-ring absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left }}
                aria-current={isActive ? 'location' : undefined}
                aria-label={`Jump to ${layer.label}`}
              >
                <span className={`block h-2 w-2 rounded-full border border-current ${isActive ? 'bg-current' : ''}`} />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
