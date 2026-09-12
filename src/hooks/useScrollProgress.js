import { useEffect } from 'react';
import { applyProgress, scrollProgressFromY } from '../lib/progress';

export function useScrollProgress(progressRef, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    let frame = 0;

    const update = () => {
      applyProgress(scrollProgressFromY(window.scrollY), progressRef);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [progressRef, enabled]);
}
