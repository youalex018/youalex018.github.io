import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  COCKPIT_PROGRESS,
  LAYER_TO_TAB,
  MODES,
  TABS,
  persistMode,
  resolveInitialMode,
  tabFromHash,
} from '../data/modes';
import { useProgressTween } from '../hooks/useProgressTween';
import { jumpTo } from '../lib/jump';
import { applyProgress, scrollProgressFromY } from '../lib/progress';

const ViewModeContext = createContext(null);

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function ViewModeProvider({ children }) {
  const progressRef = useRef(0);
  const savedScrollY = useRef(0);
  const modeRef = useRef(resolveInitialMode());
  const switchingRef = useRef(false);
  const tweenTo = useProgressTween(progressRef);

  const [mode, setModeState] = useState(modeRef.current);
  const [phase, setPhase] = useState('idle');
  const [leaving, setLeaving] = useState(null);
  const [tab, setTabState] = useState(() =>
    tabFromHash(typeof window !== 'undefined' ? window.location.hash : ''),
  );

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.dataset.mode = modeRef.current;
    persistMode(modeRef.current);
    if (modeRef.current === MODES.ORBIT) {
      applyProgress(COCKPIT_PROGRESS, progressRef);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    persistMode(mode);
  }, [mode]);

  const setTab = useCallback((next) => {
    if (next !== TABS.PROJECTS && next !== TABS.EXPERIENCE) return;
    setTabState(next);
  }, []);

  const setMode = useCallback(
    async (next) => {
      if (next !== MODES.ASCENT && next !== MODES.ORBIT) return;
      if (next === modeRef.current || switchingRef.current) return;

      switchingRef.current = true;
      const html = document.documentElement;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tweenMs = reduced ? 0 : 900;
      const settleMs = reduced ? 150 : 900;

      modeRef.current = next;

      if (next === MODES.ORBIT) {
        savedScrollY.current = window.scrollY;
        setLeaving(MODES.ASCENT);
        setPhase('exiting');
        setModeState(MODES.ORBIT);
        html.dataset.mode = MODES.ORBIT;
        persistMode(MODES.ORBIT);
        await Promise.all([tweenTo(COCKPIT_PROGRESS, tweenMs), wait(settleMs)]);
      } else {
        setLeaving(MODES.ORBIT);
        setPhase('entering');
        html.classList.add('no-smooth');
        html.dataset.mode = MODES.ASCENT;
        persistMode(MODES.ASCENT);
        setModeState(MODES.ASCENT);
        await new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        });
        const target = scrollProgressFromY(savedScrollY.current || 0);
        await Promise.all([tweenTo(target, tweenMs), wait(settleMs)]);
        html.classList.remove('no-smooth');
      }

      setLeaving(null);
      setPhase('idle');
      switchingRef.current = false;
    },
    [tweenTo],
  );

  const toggleMode = useCallback(() => {
    void setMode(modeRef.current === MODES.ORBIT ? MODES.ASCENT : MODES.ORBIT);
  }, [setMode]);

  const navigate = useCallback(
    (layerId) => {
      if (modeRef.current === MODES.ASCENT) {
        jumpTo(layerId);
        return;
      }
      const nextTab = LAYER_TO_TAB[layerId];
      if (nextTab) {
        setTab(nextTab);
        window.requestAnimationFrame(() => {
          document.getElementById('cockpit-deck')?.focus({ preventScroll: true });
        });
        return;
      }
      document.getElementById('cockpit-hero')?.focus({ preventScroll: true });
    },
    [setTab],
  );

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
      phase,
      leaving,
      tab,
      setTab,
      navigate,
      progressRef,
      savedScrollY,
    }),
    [mode, setMode, toggleMode, phase, leaving, tab, setTab, navigate],
  );

  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) {
    throw new Error('useViewMode must be used within ViewModeProvider');
  }
  return ctx;
}
