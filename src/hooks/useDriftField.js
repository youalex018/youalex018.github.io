import { useEffect } from 'react';

const EDGE = 0.08;
const RAMP = 0.24;

function documentTop(el) {
  let top = 0;
  for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
  return top;
}

function ease(t) {
  return t * t * (3 - 2 * t);
}

// Fades content blocks as they cross the screen edges. Blocks taller than the
// viewport stay fully visible, so a long list never fades while you're in it.
// Offsets ignore transforms, so the drift offset never feeds back into the
// measurement; scroll frames are pure arithmetic with no layout reads.
export function useDriftField(rootRef, reduced) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;

    let frame = 0;
    let blocks = [];
    let vh = window.innerHeight;

    const measure = () => {
      vh = window.innerHeight;
      blocks = [...root.querySelectorAll('[data-drift]')].map((el, index) => ({
        el,
        top: documentTop(el),
        height: el.offsetHeight,
        drift: blocks[index]?.el === el ? blocks[index].drift : -1,
        dir: blocks[index]?.el === el ? blocks[index].dir : 0,
      }));
    };

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const ramp = RAMP * vh;
      blocks.forEach((block) => {
        const top = block.top - scrollY;
        const bottom = top + block.height;
        const room = Math.min(bottom - EDGE * vh, (1 - EDGE) * vh - top);
        const drift = Math.round(ease(Math.min(1, Math.max(0, room / ramp))) * 500) / 500;
        const dir = top + block.height / 2 < vh / 2 ? -1 : 1;
        if (drift !== block.drift) {
          block.drift = drift;
          block.el.style.setProperty('--drift', drift);
        }
        if (dir !== block.dir) {
          block.dir = dir;
          block.el.style.setProperty('--drift-dir', dir);
        }
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const remeasure = () => {
      measure();
      schedule();
    };

    const observer = new ResizeObserver(remeasure);
    observer.observe(root);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure, { passive: true });
    remeasure();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootRef, reduced]);
}
