import { useCallback, useRef } from 'react';
import { applyProgress } from '../lib/progress';

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export function useProgressTween(progressRef) {
  const frameRef = useRef(0);

  const tweenTo = useCallback(
    (target, duration = 900) => {
      return new Promise((resolve) => {
        cancelAnimationFrame(frameRef.current);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced || duration <= 0) {
          applyProgress(target, progressRef);
          resolve();
          return;
        }

        const from = progressRef.current ?? 0;
        const start = performance.now();

        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          applyProgress(from + (target - from) * easeOutCubic(t), progressRef);
          if (t < 1) {
            frameRef.current = requestAnimationFrame(tick);
          } else {
            resolve();
          }
        };

        frameRef.current = requestAnimationFrame(tick);
      });
    },
    [progressRef],
  );

  return tweenTo;
}
