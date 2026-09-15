import { Aurora } from './components/background/Aurora';
import { Clouds } from './components/background/Clouds';
import { HorizonLimb } from './components/background/HorizonLimb';
import { Nebula } from './components/background/Nebula';
import { SkyBackdrop } from './components/background/SkyBackdrop';
import { Starfield } from './components/background/Starfield';
import { SiteHeader } from './components/chrome/SiteHeader';
import { ViewStage } from './components/chrome/ViewStage';
import { MODES } from './data/modes';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useViewMode, ViewModeProvider } from './state/ViewModeContext';

function AppShell() {
  const { mode, progressRef } = useViewMode();
  const reduced = useReducedMotion();

  return (
    <>
      <a href={mode === MODES.ORBIT ? '#cockpit-deck' : '#troposphere'} className="skip-link">
        Skip to content
      </a>
      <SkyBackdrop />
      <Starfield progressRef={progressRef} reduced={reduced} />
      <Clouds />
      <Aurora />
      <Nebula />
      <HorizonLimb />
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
