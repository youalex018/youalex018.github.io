import { useRef } from 'react';
import { Aurora } from './components/background/Aurora';
import { Clouds } from './components/background/Clouds';
import { Nebula } from './components/background/Nebula';
import { SkyBackdrop } from './components/background/SkyBackdrop';
import { Starfield } from './components/background/Starfield';
import { AltitudeMeter } from './components/chrome/AltitudeMeter';
import { SiteHeader } from './components/chrome/SiteHeader';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { Experience } from './components/sections/Experience';
import { Hero } from './components/sections/Hero';
import { Projects } from './components/sections/Projects';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useScrollProgress } from './hooks/useScrollProgress';

function App() {
  const progressRef = useRef(0);
  const reduced = useReducedMotion();
  useScrollProgress(progressRef);

  return (
    <>
      <a href="#troposphere" className="skip-link">
        Skip to content
      </a>
      <SkyBackdrop />
      <Starfield progressRef={progressRef} reduced={reduced} />
      <Clouds />
      <Aurora />
      <Nebula />
      <SiteHeader />
      <AltitudeMeter progressRef={progressRef} />
      <main className="pb-16 md:pb-0">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  );
}

export default App;
