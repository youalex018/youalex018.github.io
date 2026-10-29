import { useEffect, useRef } from 'react';
import { navigate } from '../../writing/route';

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

const DUST_MARGIN = 12;
const DUST_PARALLAX = 6;
const DRIFT_SHARE = 0.4;
const WRAP_MARGIN = 24;
const MAX_DT = 50;
const METEOR_LIFE_MS = 900;
const METEOR_SPEED = 520;

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
  const base = Math.round((width * height) / 7000);
  const count = Math.round(Math.min(260, Math.max(90, base)) * (isMobile ? 0.6 : 1));
  const stars = [];
  for (let i = 0; i < count; i += 1) {
    const bright = rand() < 0.06;
    const depth = 0.3 + rand() * 0.7;
    const heading = TILT + (rand() - 0.5) * 0.5;
    const speed = rand() < DRIFT_SHARE ? (1.5 + rand() * 4.5) * depth : 0;
    stars.push({
      x: rand() * width,
      y: rand() * height,
      r: bright ? 1.2 + rand() * 0.4 : 0.3 + rand() * 0.8,
      a: bright ? 0.7 + rand() * 0.2 : 0.15 + rand() * 0.35,
      depth,
      vx: (Math.cos(heading) * speed) / 1000,
      vy: (Math.sin(heading) * speed) / 1000,
      twinkle: bright ? (Math.PI * 2) / (3000 + rand() * 4000) : 0,
      phase: rand() * Math.PI * 2,
    });
  }
  return stars;
}

/** Void, lift gradient and far dust, painted once per resize. */
function paintBackdrop(width, height, dpr, geo) {
  const canvas = document.createElement('canvas');
  const w = width + DUST_MARGIN * 2;
  const h = height + DUST_MARGIN * 2;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.fillStyle = VOID;
  ctx.fillRect(0, 0, w, h);
  const cx = geo.cx + DUST_MARGIN;
  const cy = geo.cy + DUST_MARGIN;
  const lift = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.7);
  lift.addColorStop(0, `rgba(${ABYSS}, 1)`);
  lift.addColorStop(1, `rgba(${ABYSS}, 0)`);
  ctx.fillStyle = lift;
  ctx.fillRect(0, 0, w, h);

  const rand = mulberry32(2207);
  const base = Math.round((w * h) / 2600);
  const count = Math.round(Math.min(650, Math.max(160, base)) * (geo.isMobile ? 0.55 : 1));
  ctx.fillStyle = `rgb(${STARLIGHT})`;
  for (let i = 0; i < count; i += 1) {
    const size = (0.25 + rand() * 0.35) * 2;
    ctx.globalAlpha = 0.08 + rand() * 0.2;
    ctx.fillRect(rand() * w, rand() * h, size, size);
  }
  ctx.globalAlpha = 1;
  return canvas;
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

const HOVER_SCALE = 1.16;

export function OrbitBackdrop({ active, reduced }) {
  const canvasRef = useRef(null);
  const wellRef = useRef(null);
  const hoverRef = useRef(false);
  const pokeRef = useRef(() => {});

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
    let backdrop = null;
    let frame = 0;
    let resizeFrame = 0;
    let running = false;
    let bodyScale = 1;
    let lastTime = null;

    const meteor = { active: false, start: 0, next: 0, x: 0, y: 0, dx: 0, dy: 0, len: 0 };

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
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      geo = layout(width, height);
      stars = seedStars(width, height, geo.isMobile);
      backdrop = paintBackdrop(width, height, dpr, geo);
    };

    const ringLight = (strength) => {
      const grad = ctx.createRadialGradient(pointer.sx, pointer.sy, 0, pointer.sx, pointer.sy, LIGHT_RADIUS);
      grad.addColorStop(0, `rgba(${DAWN}, ${0.8 * strength})`);
      grad.addColorStop(0.45, `rgba(${DAWN}, ${0.3 * strength})`);
      grad.addColorStop(1, `rgba(${DAWN}, 0)`);
      return grad;
    };

    const strokeRings = (start, end, ox, oy, lightGrad) => {
      geo.rings.forEach((ring) => {
        ctx.beginPath();
        ctx.ellipse(geo.cx + ox, geo.cy + oy, ring.rx, ring.ry, TILT, start, end);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${CHART}, ${ring.alpha})`;
        ctx.stroke();
        if (lightGrad) {
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = lightGrad;
          ctx.stroke();
        }
      });
    };

    const scheduleMeteor = (time) => {
      meteor.next = time + 25000 + Math.random() * 15000;
    };

    const launchMeteor = (time) => {
      const angle = Math.PI * 0.8 + Math.random() * 0.12;
      meteor.active = true;
      meteor.start = time;
      meteor.x = width * (geo.isMobile ? 0.25 + Math.random() * 0.65 : 0.5 + Math.random() * 0.45);
      meteor.y = height * (geo.isMobile ? 0.32 + Math.random() * 0.23 : 0.05 + Math.random() * 0.3);
      meteor.dx = Math.cos(angle);
      meteor.dy = Math.sin(angle);
      meteor.len = 90 + Math.random() * 50;
    };

    const drawMeteor = (time) => {
      if (!meteor.next) {
        scheduleMeteor(time);
        return;
      }
      if (!meteor.active) {
        if (time >= meteor.next) launchMeteor(time);
        else return;
      }
      const elapsed = time - meteor.start;
      const p = elapsed / METEOR_LIFE_MS;
      if (p >= 1) {
        meteor.active = false;
        scheduleMeteor(time);
        return;
      }
      const travel = (elapsed / 1000) * METEOR_SPEED;
      const hx = meteor.x + meteor.dx * travel;
      const hy = meteor.y + meteor.dy * travel;
      const tail = meteor.len * Math.min(1, p * 3);
      const tx = hx - meteor.dx * tail;
      const ty = hy - meteor.dy * tail;
      const alpha = 0.5 * Math.sin(p * Math.PI);
      const grad = ctx.createLinearGradient(tx, ty, hx, hy);
      grad.addColorStop(0, `rgba(${STARLIGHT}, 0)`);
      grad.addColorStop(1, `rgba(${STARLIGHT}, ${alpha})`);
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.stroke();
    };

    const placeWell = (x, y, radius, scale) => {
      const well = wellRef.current;
      if (!well) return;
      const size = radius * 2;
      well.style.width = `${size}px`;
      well.style.height = `${size}px`;
      well.style.transform = `translate3d(${x - radius}px, ${y - radius}px, 0) scale(${scale})`;
    };

    const drawPlanet = (ox, oy, scale) => {
      const x = geo.cx + ox;
      const y = geo.cy + oy;
      const r = geo.radius * scale;

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
      placeWell(x, y, geo.radius, scale);
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

      const dt = animated && lastTime !== null ? Math.min(MAX_DT, Math.max(0, time - lastTime)) : 0;
      if (animated) lastTime = time;

      ctx.drawImage(
        backdrop,
        pointer.snx * DUST_PARALLAX - DUST_MARGIN,
        pointer.sny * DUST_PARALLAX - DUST_MARGIN,
        width + DUST_MARGIN * 2,
        height + DUST_MARGIN * 2,
      );

      const presence = interactive ? pointer.presence : 0;
      const spanX = width + WRAP_MARGIN * 2;
      const spanY = height + WRAP_MARGIN * 2;
      ctx.fillStyle = `rgb(${STARLIGHT})`;
      stars.forEach((star) => {
        if (dt && (star.vx || star.vy)) {
          star.x += star.vx * dt;
          star.y += star.vy * dt;
          if (star.x > width + WRAP_MARGIN) star.x -= spanX;
          else if (star.x < -WRAP_MARGIN) star.x += spanX;
          if (star.y > height + WRAP_MARGIN) star.y -= spanY;
          else if (star.y < -WRAP_MARGIN) star.y += spanY;
        }
        let x = star.x + pointer.snx * star.depth * 20;
        let y = star.y + pointer.sny * star.depth * 20;
        let a = star.twinkle && animated
          ? star.a * (0.78 + 0.22 * Math.sin(time * star.twinkle + star.phase))
          : star.a;
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
        if (star.r < 0.7) {
          ctx.fillRect(x - star.r, y - star.r, star.r * 2, star.r * 2);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      if (animated) drawMeteor(time);

      const ox = pointer.snx * 8;
      const oy = pointer.sny * 8;
      const light = presence * (0.35 + 0.65 * Math.min(1, pointer.energy));
      const lightGrad = light > 0.01 ? ringLight(light) : null;
      const theta = animated ? BODY_PARKED + (time / BODY_PERIOD_MS) * Math.PI * 2 : BODY_PARKED;
      const bodyInFront = Math.sin(theta) > 0;
      const targetScale = hoverRef.current ? HOVER_SCALE : 1;
      bodyScale += (targetScale - bodyScale) * (animated ? 0.14 : 1);

      strokeRings(Math.PI, Math.PI * 2, ox, oy, lightGrad);
      if (!bodyInFront) drawBody(theta, ox, oy);
      drawPlanet(ox, oy, bodyScale);
      strokeRings(0, Math.PI, ox, oy, lightGrad);
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
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
        // Resizing clears the canvas, so repaint now instead of waiting a frame.
        draw(performance.now());
      });
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    pokeRef.current = () => {
      if (!running) draw(performance.now());
    };

    resize();
    draw(performance.now());
    start();

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    if (interactive && animated) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
    }

    return () => {
      pokeRef.current = () => {};
      stop();
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [active, reduced]);

  return (
    <>
      <div className="orbit-backdrop pointer-events-none fixed inset-0 z-[4]" aria-hidden="true">
        <canvas ref={canvasRef} className="block" />
      </div>
      {active ? (
        <button
          ref={wellRef}
          type="button"
          className="orbit-well"
          aria-label="Notes"
          onClick={() => navigate('/notes')}
          onPointerEnter={() => {
            hoverRef.current = true;
            pokeRef.current();
          }}
          onPointerLeave={() => {
            hoverRef.current = false;
            pokeRef.current();
          }}
        />
      ) : null}
    </>
  );
}
