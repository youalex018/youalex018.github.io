import { MODES } from '../../data/modes';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useViewMode } from '../../state/ViewModeContext';
import { CockpitView } from '../cockpit/CockpitView';
import { ExpeditionView } from '../expedition/ExpeditionView';

export function ViewStage() {
  const { mode, leaving, phase, progressRef, savedScrollY } = useViewMode();
  useScrollProgress(progressRef, mode === MODES.ASCENT && phase === 'idle');

  const showAscent = mode === MODES.ASCENT || leaving === MODES.ASCENT;
  const showOrbit = mode === MODES.ORBIT || leaving === MODES.ORBIT;

  const ascentClass =
    mode === MODES.ORBIT && leaving === MODES.ASCENT
      ? 'expedition-exit'
      : mode === MODES.ASCENT && leaving === MODES.ORBIT
        ? 'expedition-enter'
        : '';

  const orbitClass =
    mode === MODES.ORBIT && leaving === MODES.ASCENT
      ? 'view-enter'
      : mode === MODES.ASCENT && leaving === MODES.ORBIT
        ? 'view-exit'
        : '';

  return (
    <>
      {showAscent ? (
        <ExpeditionView
          progressRef={progressRef}
          savedScrollY={savedScrollY}
          className={ascentClass}
          inert={mode !== MODES.ASCENT}
        />
      ) : null}
      {showOrbit ? (
        <CockpitView className={orbitClass} inert={mode !== MODES.ORBIT} />
      ) : null}
    </>
  );
}
