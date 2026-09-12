import { useLayoutEffect } from 'react';
import { AltitudeMeter } from '../chrome/AltitudeMeter';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Experience } from '../sections/Experience';
import { Hero } from '../sections/Hero';
import { Projects } from '../sections/Projects';

export function ExpeditionView({ progressRef, savedScrollY, className = '', inert: isInert = false }) {
  useLayoutEffect(() => {
    const y = savedScrollY?.current;
    if (typeof y === 'number' && y > 0) {
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
    }
  }, [savedScrollY]);
  return (
    <div className={className} inert={isInert || undefined}>
      <AltitudeMeter progressRef={progressRef} />
      <main className="pb-16 md:pb-0">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
