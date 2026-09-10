import { useEffect } from 'react';
import { inkForProgress } from '../lib/color';

export function useScrollProgress(progressRef) {
  useEffect(() => {
    let frame = 0;

    let lastInk = '';

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const next = max > 0 ? window.scrollY / max : 0;
      const clamped = Math.min(1, Math.max(0, next));
      progressRef.current = clamped;
      doc.style.setProperty('--progress', clamped.toFixed(4));
      const { ink, muted } = inkForProgress(clamped);
      // Ink only changes across a narrow band; skip the write otherwise.
      if (ink !== lastInk) {
        lastInk = ink;
        doc.style.setProperty('--chrome-ink', ink);
        doc.style.setProperty('--chrome-muted', muted);
      }
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
  }, [progressRef]);
}
