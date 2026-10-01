import { useEffect, useRef, useState } from 'react';
import { Aurora } from './components/background/Aurora';
import { Clouds } from './components/background/Clouds';
import { Nebula } from './components/background/Nebula';
import { OrbitBackdrop } from './components/background/OrbitBackdrop';
import { SkyBackdrop } from './components/background/SkyBackdrop';
import { Starfield } from './components/background/Starfield';
import { SiteHeader } from './components/chrome/SiteHeader';
import { ViewStage } from './components/chrome/ViewStage';
import { MODES } from './data/modes';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useViewMode, ViewModeProvider } from './state/ViewModeContext';
import WritingApp from './writing/WritingApp';
import { usePathname } from './writing/route';

function AppShell() {
  const { mode, leaving, phase, progressRef } = useViewMode();
  const reduced = useReducedMotion();
  const orbitActive = mode === MODES.ORBIT || leaving === MODES.ORBIT;
  const skyHidden = mode === MODES.ORBIT && phase === 'idle';

  return (
    <>
      <a href={mode === MODES.ORBIT ? '#cockpit-deck' : '#troposphere'} className="skip-link">
        Skip to content
      </a>
      <div className={skyHidden ? 'sky-parked' : undefined}>
        <SkyBackdrop />
        <Starfield progressRef={progressRef} reduced={reduced} paused={skyHidden} />
        <Clouds />
        <Aurora />
        <Nebula />
      </div>
      <OrbitBackdrop active={orbitActive} reduced={reduced} />
      <SiteHeader />
      <ViewStage />
    </>
  );
}

function PortfolioApp() {
  return (
    <ViewModeProvider>
      <AppShell />
    </ViewModeProvider>
  );
}

function App() {
  const pathname = usePathname();
  const isWriting = pathname === '/writing' || pathname.startsWith('/writing/');
  const reduced = useReducedMotion();
  const fromPortfolio = useRef(false);
  const [handoff, setHandoff] = useState(false);

  useEffect(() => {
    if (!isWriting) {
      fromPortfolio.current = true;
      setHandoff(false);
      return undefined;
    }
    if (!fromPortfolio.current || reduced) return undefined;

    setHandoff(true);
    const id = window.setTimeout(() => setHandoff(false), 920);
    return () => window.clearTimeout(id);
  }, [isWriting, reduced]);

  const showPortfolio = !isWriting || handoff;

  return (
    <>
      {showPortfolio ? (
        <div className={handoff ? 'portfolio-handoff' : undefined}>
          <PortfolioApp />
        </div>
      ) : null}
      {isWriting ? <WritingApp entering={handoff} /> : null}
    </>
  );
}

export default App;
