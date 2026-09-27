import { useEffect, useLayoutEffect, useRef } from 'react';
import { LAYER_IDS } from '../../data/layers';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useDriftField } from '../../hooks/useDriftField';
import { applyProgress, scrollProgressFromY, scrollYFromProgress } from '../../lib/progress';
import { CloudsFore } from '../background/Clouds';
import { AltitudeMeter } from '../chrome/AltitudeMeter';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Experience } from '../sections/Experience';
import { Hero } from '../sections/Hero';
import { Projects } from '../sections/Projects';

export function ExpeditionView({ progressRef, savedProgress, className = '', inert: isInert = false }) {
  const mainRef = useRef(null);
  useDriftField(mainRef, useReducedMotion());

  useLayoutEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const progress = LAYER_IDS.includes(hash) ? null : (savedProgress?.current ?? 0);
    if (progress === null) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      applyProgress(scrollProgressFromY(window.scrollY), progressRef);
      return;
    }
    // Set progress before the pin effect runs, so a restore from Orbit is not
    // yanked back to the cockpit altitude.
    applyProgress(progress, progressRef);
    window.scrollTo({ top: scrollYFromProgress(progress), left: 0, behavior: 'instant' });
  }, [savedProgress, progressRef]);

  // Content above the viewport (images, web fonts) can grow after first paint
  // and shove the view down. Hold the current altitude until the user scrolls.
  // Skip while the view is leaving, so the Orbit tween cannot drag this page.
  useEffect(() => {
    const main = mainRef.current;
    if (!main || isInert) return undefined;
    let pinned = true;
    const release = () => {
      pinned = false;
    };
    const hold = () => {
      if (pinned) window.scrollTo({ top: scrollYFromProgress(progressRef.current ?? 0), left: 0, behavior: 'instant' });
    };
    const observer = new ResizeObserver(hold);
    observer.observe(main);
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('pointerdown', release, { passive: true });
    window.addEventListener('keydown', release);
    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', release);
      window.removeEventListener('pointerdown', release);
      window.removeEventListener('keydown', release);
    };
  }, [progressRef, isInert]);

  return (
    <div className={`relative z-10 ${className}`} inert={isInert || undefined}>
      <AltitudeMeter progressRef={progressRef} />
      <CloudsFore />
      <main ref={mainRef} className="relative z-10 flex flex-col-reverse pb-16 md:pb-0">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
