import { useEffect, useRef, useState } from 'react';

const DAWN = '244, 213, 141';

/** Matches the .orbit-cursor box in index.css. The pointer sits at its centre. */
const SIZE = 180;
const HALF = SIZE / 2;
const MAX_LENGTH = HALF - 8;
const LIFE_MS = 280;
const SINK_MS = 320;
const STEP = 1.25;
const MAX_STAMPS = Math.ceil(MAX_LENGTH / STEP) + 4;
const MAX_POINTS = 160;

/**
 * A gold trail behind the system cursor on the orbit page. The cursor itself is
 * untouched: this only paints where the pointer has just been, on a small canvas
 * that follows it, and stops drawing a moment after the pointer rests.
 */
export function OrbitCursor({ active, reduced }) {
  const canvasRef = useRef(null);
  const [fine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  );
  const enabled = active && !reduced && fine;

  useEffect(() => {
    if (!enabled) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return undefined;

    const html = document.documentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = `rgb(${DAWN})`;

    /** Where the pointer has been, oldest first: { x, y, t }. */
    const points = [];
    /** Evenly spaced [x, y, strength] dots along the trail, rebuilt each frame. */
    const stamps = new Float32Array(MAX_STAMPS * 3);
    let frame = 0;
    let sinkStart = 0;
    let holeX = 0;
    let holeY = 0;

    const dots = (count, alpha, base, grow) => {
      for (let i = 0; i < count; i += 1) {
        const strength = stamps[i * 3 + 2];
        ctx.globalAlpha = alpha * strength;
        ctx.beginPath();
        ctx.arc(stamps[i * 3], stamps[i * 3 + 1], base + grow * strength, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      frame = 0;
      const now = performance.now();
      ctx.clearRect(0, 0, SIZE, SIZE);

      // While the hole swallows the page, what is left of the trail goes with it.
      let fade = 1;
      if (html.hasAttribute('data-swallow')) {
        if (!sinkStart) {
          sinkStart = now;
          holeX = parseFloat(html.style.getPropertyValue('--hole-x')) || 0;
          holeY = parseFloat(html.style.getPropertyValue('--hole-y')) || 0;
        }
        fade = 1 - (now - sinkStart) / SINK_MS;
        points.forEach((point) => {
          point.x += (holeX - point.x) * 0.16;
          point.y += (holeY - point.y) * 0.16;
        });
      } else {
        sinkStart = 0;
      }

      while (points.length && now - points[0].t > LIFE_MS) points.shift();
      if (fade <= 0) points.length = 0;
      if (points.length < 2) return;

      const head = points[points.length - 1];
      canvas.style.transform = `translate3d(${head.x - HALF}px, ${head.y - HALF}px, 0)`;

      // Walk back from the pointer, dropping a dot every STEP pixels. Each dot is
      // weaker the older it is and the further it sits from the pointer.
      let count = 0;
      let travelled = 0;
      let carry = 0;
      for (let i = points.length - 1; i > 0 && travelled < MAX_LENGTH; i -= 1) {
        const a = points[i];
        const b = points[i - 1];
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        for (let d = carry; d < length && count < MAX_STAMPS; d += STEP) {
          const f = d / length;
          const age = (now - (a.t + (b.t - a.t) * f)) / LIFE_MS;
          const strength = (1 - age) * (1 - (travelled + d) / MAX_LENGTH);
          if (strength <= 0) continue;
          stamps[count * 3] = a.x + (b.x - a.x) * f - head.x + HALF;
          stamps[count * 3 + 1] = a.y + (b.y - a.y) * f - head.y + HALF;
          stamps[count * 3 + 2] = strength;
          count += 1;
        }
        carry += Math.max(0, Math.ceil((length - carry) / STEP)) * STEP - length;
        travelled += length;
      }

      // A faster pointer leaves a longer trail, and a brighter one.
      const energy = (0.4 + 0.6 * Math.min(1, travelled / MAX_LENGTH)) * fade;
      dots(count, 0.035 * energy, 2, 4);
      dots(count, 0.55 * energy, 0.3, 1.1);
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch' || html.hasAttribute('data-swallow')) return;
      const coalesced = event.getCoalescedEvents?.() ?? [];
      const samples = coalesced.length ? coalesced : [event];
      samples.forEach((sample) => {
        const last = points[points.length - 1];
        const x = sample.clientX;
        const y = sample.clientY;
        if (last && Math.abs(x - last.x) + Math.abs(y - last.y) < 1) return;
        points.push({ x, y, t: sample.timeStamp || event.timeStamp });
      });
      if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return enabled ? <canvas ref={canvasRef} className="orbit-cursor" aria-hidden="true" /> : null;
}
