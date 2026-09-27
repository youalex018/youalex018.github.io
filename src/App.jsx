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
      <SkyBackdrop />
      <Starfield progressRef={progressRef} reduced={reduced} paused={skyHidden} />
      <Clouds />
      <Aurora />
      <Nebula />
      <OrbitBackdrop active={orbitActive} reduced={reduced} />
      <SiteHeader />
      <ViewStage />
    </>
  );
}

function App() {
  return (
    <ViewModeProvider>
      <AppShell />
    </ViewModeProvider>
  );
}

export default App;
