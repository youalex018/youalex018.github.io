import { useEffect, useRef } from 'react';

const VOID = '#050814';
const ABYSS = '11, 18, 36';
const CHART = '138, 156, 194';
const STARLIGHT = '220, 228, 245';
const DAWN = '244, 213, 141';

const TILT = (-10 * Math.PI) / 180;
const RING_SCALES = [2.1, 3.3, 5, 7.4, 10.8];
const RING_ALPHAS = [0.14, 0.13, 0.115, 0.095, 0.08];
const RING_ASPECT = 0.34;
const BODY_RING = 2;
const BODY_PERIOD_MS = 80000;
const BODY_PARKED = 0.6;

const LENS_RADIUS = 160;
const LENS_PULL = 10;
const LIGHT_RADIUS = 220;
const POINTER_RING = { rx: 18, ry: 6.5, periodMs: 2200 };

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedStars(width, height, isMobile) {
  const rand = mulberry32(1540);
  const base = Math.round((width * height) / 9000);
  const count = Math.round(Math.min(200, Math.max(80, base)) * (isMobile ? 0.6 : 1));
  const stars = [];
  for (let i = 0; i < count; i += 1) {
    const bright = rand() < 0.06;
    stars.push({
      x: rand() * width,
      y: rand() * height,
      r: bright ? 1.2 + rand() * 0.4 : 0.3 + rand() * 0.8,
      a: bright ? 0.7 + rand() * 0.2 : 0.15 + rand() * 0.35,
      depth: 0.3 + rand() * 0.7,
    });
  }
  return stars;
}

function layout(width, height) {
  const isMobile = width < 768;
  const radius = isMobile
    ? Math.min(20, Math.max(14, width * 0.045))
    : Math.min(56, Math.max(28, Math.min(width, height) * 0.055));
  return {
    isMobile,
    cx: isMobile ? width * 0.74 : width * 0.22,
    cy: isMobile ? 172 : height * 0.74,
    radius,
    rings: RING_SCALES.map((scale, i) => ({
      rx: radius * scale,
      ry: radius * scale * RING_ASPECT,
      alpha: RING_ALPHAS[i],
    })),
  };
}

function pointOnRing(geo, ring, theta, ox, oy) {
  const lx = ring.rx * Math.cos(theta);
  const ly = ring.ry * Math.sin(theta);
  return {
    x: geo.cx + ox + lx * Math.cos(TILT) - ly * Math.sin(TILT),
    y: geo.cy + oy + lx * Math.sin(TILT) + ly * Math.cos(TILT),
  };
}

export function OrbitBackdrop({ active, reduced }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return undefined;

    const interactive = !reduced && window.matchMedia('(pointer: fine)').matches;
    const animated = active && !reduced;

    let width = 0;
    let height = 0;
    let geo = null;
    let stars = [];
    let frame = 0;
    let running = false;

    const pointer = {
      x: 0,
      y: 0,
      sx: 0,
      sy: 0,
      nx: 0,
      ny: 0,
      snx: 0,
      sny: 0,
      present: false,
      presence: 0,
      energy: 0,
      seeded: false,
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      geo = layout(width, height);
      stars = seedStars(width, height, geo.isMobile);
    };

    const ringLight = (strength) => {
      const grad = ctx.createRadialGradient(pointer.sx, pointer.sy, 0, pointer.sx, pointer.sy, LIGHT_RADIUS);
      grad.addColorStop(0, `rgba(${DAWN}, ${0.8 * strength})`);
      grad.addColorStop(0.45, `rgba(${DAWN}, ${0.3 * strength})`);
      grad.addColorStop(1, `rgba(${DAWN}, 0)`);
      return grad;
    };

    const strokeRings = (start, end, ox, oy, lightStrength) => {
      geo.rings.forEach((ring) => {
        ctx.beginPath();
        ctx.ellipse(geo.cx + ox, geo.cy + oy, ring.rx, ring.ry, TILT, start, end);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${CHART}, ${ring.alpha})`;
        ctx.stroke();
        if (lightStrength > 0.01) {
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = ringLight(lightStrength);
          ctx.stroke();
        }
      });
    };

    const drawPlanet = (ox, oy) => {
      const x = geo.cx + ox;
      const y = geo.cy + oy;
      const r = geo.radius;

      const halo = ctx.createRadialGradient(x, y, r, x, y, r * 1.7);
      halo.addColorStop(0, `rgba(${CHART}, 0.1)`);
      halo.addColorStop(1, `rgba(${CHART}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgb(${ABYSS})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      const lit = ctx.createLinearGradient(x + r * 0.8, y - r * 0.8, x - r * 0.4, y + r * 0.4);
      lit.addColorStop(0, `rgba(${DAWN}, 0.2)`);
      lit.addColorStop(0.5, `rgba(${DAWN}, 0.03)`);
      lit.addColorStop(1, `rgba(${DAWN}, 0)`);
      ctx.fillStyle = lit;
      ctx.fill();

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(${DAWN}, 0.55)`;
      ctx.beginPath();
      ctx.arc(x, y, r - 0.6, -Math.PI * 0.82, Math.PI * 0.08);
      ctx.stroke();
    };

    const drawBody = (theta, ox, oy) => {
      const ring = geo.rings[BODY_RING];
      const segments = 10;
      const span = 0.34;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      for (let i = 0; i < segments; i += 1) {
        const a0 = theta - span * ((i + 1) / segments);
        const a1 = theta - span * (i / segments);
        const p0 = pointOnRing(geo, ring, a0, ox, oy);
        const p1 = pointOnRing(geo, ring, a1, ox, oy);
        ctx.strokeStyle = `rgba(${DAWN}, ${0.5 * (1 - i / segments)})`;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
      const head = pointOnRing(geo, ring, theta, ox, oy);
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 9);
      glow.addColorStop(0, `rgba(${DAWN}, 0.45)`);
      glow.addColorStop(1, `rgba(${DAWN}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgb(${DAWN})`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPointerOrbit = (time) => {
      const alpha = pointer.energy * pointer.presence;
      if (alpha < 0.01) return;
      const { rx, ry, periodMs } = POINTER_RING;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${STARLIGHT}, ${0.35 * alpha})`;
      ctx.beginPath();
      ctx.ellipse(pointer.sx, pointer.sy, rx, ry, TILT, 0, Math.PI * 2);
      ctx.stroke();
      const phi = (time / periodMs) * Math.PI * 2;
      const lx = rx * Math.cos(phi);
      const ly = ry * Math.sin(phi);
      ctx.fillStyle = `rgba(${DAWN}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(
        pointer.sx + lx * Math.cos(TILT) - ly * Math.sin(TILT),
        pointer.sy + lx * Math.sin(TILT) + ly * Math.cos(TILT),
        1.8,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    };

    const draw = (time) => {
      if (interactive) {
        pointer.sx += (pointer.x - pointer.sx) * 0.12;
        pointer.sy += (pointer.y - pointer.sy) * 0.12;
        pointer.snx += (pointer.nx - pointer.snx) * 0.06;
        pointer.sny += (pointer.ny - pointer.sny) * 0.06;
        pointer.presence += ((pointer.present ? 1 : 0) - pointer.presence) * 0.08;
        pointer.energy *= 0.96;
      }

      ctx.fillStyle = VOID;
      ctx.fillRect(0, 0, width, height);

      const lift = ctx.createRadialGradient(geo.cx, geo.cy, 0, geo.cx, geo.cy, Math.max(width, height) * 0.7);
      lift.addColorStop(0, `rgba(${ABYSS}, 1)`);
      lift.addColorStop(1, `rgba(${ABYSS}, 0)`);
      ctx.fillStyle = lift;
      ctx.fillRect(0, 0, width, height);

      const presence = interactive ? pointer.presence : 0;
      ctx.fillStyle = `rgb(${STARLIGHT})`;
      stars.forEach((star) => {
        let x = star.x + pointer.snx * star.depth * 20;
        let y = star.y + pointer.sny * star.depth * 20;
        let a = star.a;
        if (presence > 0.01) {
          const dx = pointer.sx - x;
          const dy = pointer.sy - y;
          const d = Math.hypot(dx, dy);
          if (d < LENS_RADIUS && d > 0.5) {
            const f = (1 - d / LENS_RADIUS) ** 2 * presence;
            const pull = Math.min(f * LENS_PULL, d * 0.5);
            x += (dx / d) * pull;
            y += (dy / d) * pull;
            a = Math.min(1, a + f * 0.4);
          }
        }
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(x, y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      const ox = pointer.snx * 8;
      const oy = pointer.sny * 8;
      const light = presence * (0.35 + 0.65 * Math.min(1, pointer.energy));
      const theta = animated ? BODY_PARKED + (time / BODY_PERIOD_MS) * Math.PI * 2 : BODY_PARKED;
      const bodyInFront = Math.sin(theta) > 0;

      strokeRings(Math.PI, Math.PI * 2, ox, oy, light);
      if (!bodyInFront) drawBody(theta, ox, oy);
      drawPlanet(ox, oy);
      strokeRings(0, Math.PI, ox, oy, light);
      if (bodyInFront) drawBody(theta, ox, oy);

      if (interactive) drawPointerOrbit(time);
    };

    const loop = (time) => {
      if (!running) return;
      draw(time);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || !animated || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      if (!pointer.seeded) {
        pointer.sx = event.clientX;
        pointer.sy = event.clientY;
        pointer.seeded = true;
      }
      const moved = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.nx = event.clientX / width - 0.5;
      pointer.ny = event.clientY / height - 0.5;
      pointer.present = true;
      pointer.energy = Math.min(1, pointer.energy + moved / 60);
    };

    const onPointerLeave = () => {
      pointer.present = false;
    };

    const onResize = () => {
      resize();
      if (!running) draw(0);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    draw(0);
    start();

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    if (interactive && animated) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
    }

    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [active, reduced]);

  return (
    <div className="orbit-backdrop pointer-events-none fixed inset-0 z-[4]" aria-hidden="true">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
