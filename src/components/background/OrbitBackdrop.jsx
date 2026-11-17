import { useEffect, useRef } from 'react';
import { navigate } from '../../writing/route';

const VOID = '#050814';
const ABYSS_RGB = [11, 18, 36];
/** The notes page background, so the last frame of the swallow matches the page behind it. */
const NOTES_RGB = [8, 13, 29];
const ABYSS = ABYSS_RGB.join(', ');
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

const DUST_MARGIN = 12;
const DUST_PARALLAX = 6;
const DRIFT_SHARE = 0.4;
const WRAP_MARGIN = 24;
const MAX_DT = 50;
const METEOR_LIFE_MS = 900;
const METEOR_SPEED = 520;

/** Clicking the hole plays this long before the notes page opens. */
const SWALLOW_MS = 880;
/** Share of the swallow at which the hole starts to grow, and at which it fills the screen. */
const THROAT_AT = 0.6;
const COVER_AT = 0.93;
const SWIRL_TURN = 1.6;
const STREAK = 0.024;
const RING_SPIN = 2.4;
const BODY_WHIP = 7;
const ARM_SEGMENTS = 30;

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function smooth(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function mixRgb(from, to, t) {
  return from.map((channel, i) => Math.round(channel + (to[i] - channel) * t)).join(', ');
}

/**
 * Where a point sits `progress` of the way through the swallow: it turns about
 * the hole and falls in, and points nearer the hole arrive first.
 */
function swirl(x, y, progress, hx, hy, reach, out) {
  const dx = x - hx;
  const dy = y - hy;
  const arrival = 0.5 + 0.45 * Math.min(1, Math.hypot(dx, dy) / reach);
  const u = Math.min(1, progress / arrival);
  const fall = u * u * u;
  const turn = SWIRL_TURN * u * u * (1 + 1.5 * fall);
  const cos = Math.cos(turn);
  const sin = Math.sin(turn);
  out.left = 1 - fall;
  out.x = hx + (dx * cos - dy * sin) * out.left;
  out.y = hy + (dx * sin + dy * cos) * out.left;
}

function paintVoid(ctx, w, h, cx, cy, reach) {
  ctx.fillStyle = VOID;
  ctx.fillRect(0, 0, w, h);
  const lift = ctx.createRadialGradient(cx, cy, 0, cx, cy, reach);
  lift.addColorStop(0, `rgba(${ABYSS}, 1)`);
  lift.addColorStop(1, `rgba(${ABYSS}, 0)`);
  ctx.fillStyle = lift;
  ctx.fillRect(0, 0, w, h);
}

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

/**
 * Stars just outside the screen, as [x, y, radius, alpha] quads. The swallow turns
 * the sky about an off-centre hole, so without these one side would empty out.
 */
function seedReserve(width, height, geo, fieldCount) {
  const rand = mulberry32(977);
  const reach = Math.hypot(Math.max(geo.cx, width - geo.cx), Math.max(geo.cy, height - geo.cy));
  const samples = Math.min(1400, Math.round((fieldCount * Math.PI * reach * reach) / (width * height)));
  const quads = [];
  for (let i = 0; i < samples; i += 1) {
    const distance = reach * Math.sqrt(rand());
    const angle = rand() * Math.PI * 2;
    const bright = rand() < 0.06;
    const radius = bright ? 1.2 + rand() * 0.4 : 0.3 + rand() * 0.8;
    const alpha = bright ? 0.7 + rand() * 0.2 : 0.15 + rand() * 0.35;
    const x = geo.cx + distance * Math.cos(angle);
    const y = geo.cy + distance * Math.sin(angle);
    if (x < 0 || x > width || y < 0 || y > height) quads.push(x, y, radius, alpha);
  }
  return quads;
}

/**
 * Void, lift gradient and far dust, painted once per resize. The dust is also
 * returned as [x, y, size, alpha] quads so the swallow can move each speck.
 */
function paintBackdrop(width, height, dpr, geo) {
  const canvas = document.createElement('canvas');
  const w = width + DUST_MARGIN * 2;
  const h = height + DUST_MARGIN * 2;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  paintVoid(ctx, w, h, geo.cx + DUST_MARGIN, geo.cy + DUST_MARGIN, Math.max(width, height) * 0.7);

  const rand = mulberry32(2207);
  const base = Math.round((w * h) / 2600);
  const count = Math.round(Math.min(650, Math.max(160, base)) * (geo.isMobile ? 0.55 : 1));
  const dust = new Float32Array(count * 4);
  ctx.fillStyle = `rgb(${STARLIGHT})`;
  for (let i = 0; i < count; i += 1) {
    const size = (0.25 + rand() * 0.35) * 2;
    const alpha = 0.08 + rand() * 0.2;
    const x = rand() * w;
    const y = rand() * h;
    dust.set([x, y, size, alpha], i * 4);
    ctx.globalAlpha = alpha;
    ctx.fillRect(x, y, size, size);
  }
  ctx.globalAlpha = 1;
  return { canvas, dust };
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

function pointOnRing(cx, cy, ring, theta, pose) {
  const lx = ring.rx * pose.scale * Math.cos(theta);
  const ly = ring.ry * pose.scale * Math.sin(theta);
  const cos = Math.cos(pose.tilt);
  const sin = Math.sin(pose.tilt);
  return {
    x: cx + lx * cos - ly * sin,
    y: cy + lx * sin + ly * cos,
  };
}

const HOVER_SCALE = 1.16;

export function OrbitBackdrop({ active, reduced }) {
  const canvasRef = useRef(null);
  const wellRef = useRef(null);
  const hoverRef = useRef(false);
  const pokeRef = useRef(() => {});
  const enterRef = useRef(() => navigate('/notes'));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return undefined;

    const html = document.documentElement;
    const interactive = !reduced && window.matchMedia('(pointer: fine)').matches;
    const animated = active && !reduced;

    let width = 0;
    let height = 0;
    let geo = null;
    let stars = [];
    let reserve = [];
    let backdrop = null;
    let frame = 0;
    let resizeFrame = 0;
    let running = false;
    let bodyScale = 1;
    let lastTime = null;
    let swirlReach = 0;
    let armReach = 0;
    let swallowTimer = 0;

    const meteor = { active: false, start: 0, next: 0, x: 0, y: 0, dx: 0, dy: 0, len: 0 };
    const swallow = { active: false, start: 0 };
    const poses = RING_SCALES.map(() => ({ tilt: TILT, scale: 1, gain: 1 }));
    const spot = { x: 0, y: 0, left: 1 };
    const tail = { x: 0, y: 0, left: 1 };

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
      reserve = [];
      swirlReach = Math.hypot(width, height) * 0.6;
      armReach = Math.min(640, Math.hypot(width, height) * 0.42);
    };

    const ringLight = (strength) => {
      const grad = ctx.createRadialGradient(pointer.sx, pointer.sy, 0, pointer.sx, pointer.sy, LIGHT_RADIUS);
      grad.addColorStop(0, `rgba(${DAWN}, ${0.8 * strength})`);
      grad.addColorStop(0.45, `rgba(${DAWN}, ${0.3 * strength})`);
      grad.addColorStop(1, `rgba(${DAWN}, 0)`);
      return grad;
    };

    /** One star mid-swallow, smeared along the path it has just covered. */
    const smear = (x, y, radius, alpha, sw, hx, hy) => {
      swirl(x, y, sw, hx, hy, swirlReach, spot);
      if (
        spot.left < 0.03 ||
        spot.x < -40 ||
        spot.x > width + 40 ||
        spot.y < -40 ||
        spot.y > height + 40
      ) {
        return;
      }
      swirl(x, y, Math.max(0, sw - STREAK), hx, hy, swirlReach, tail);
      ctx.globalAlpha = Math.min(1, alpha * (1 + sw)) * Math.min(1, spot.left * 6);
      ctx.lineWidth = Math.max(0.7, radius * 1.7);
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(spot.x, spot.y);
      ctx.stroke();
    };

    /**
     * During the swallow the rings tumble and collapse, inner ones first. The last
     * is gone by THROAT_AT, so none is left to cross the hole once it starts to grow.
     */
    const poseRings = (sw) => {
      const last = poses.length - 1;
      poses.forEach((pose, i) => {
        const u = sw ? Math.min(1, sw / (THROAT_AT - 0.2 + (0.2 * i) / last)) : 0;
        pose.scale = 1 - u * u * u;
        pose.tilt = TILT + RING_SPIN * u * u * (1.5 - (0.5 * i) / last);
        pose.gain = (1 + 3 * u) * Math.min(1, pose.scale * 5);
      });
    };

    const strokeRings = (start, end, hx, hy, lightGrad) => {
      geo.rings.forEach((ring, i) => {
        const pose = poses[i];
        if (pose.scale < 0.02) return;
        ctx.beginPath();
        ctx.ellipse(hx, hy, ring.rx * pose.scale, ring.ry * pose.scale, pose.tilt, start, end);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${CHART}, ${Math.min(0.6, ring.alpha * pose.gain)})`;
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

    /**
     * `closure` (0-1) closes the lit rim into a full ring as the swallow starts;
     * `throat` (0-1) is the hole growing until it fills the screen.
     */
    const drawPlanet = (x, y, r, closure, throat) => {
      const halo = ctx.createRadialGradient(x, y, r, x, y, r * 1.7);
      halo.addColorStop(0, `rgba(${CHART}, ${0.1 * (1 - throat)})`);
      halo.addColorStop(1, `rgba(${CHART}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgb(${throat ? mixRgb(ABYSS_RGB, NOTES_RGB, throat) : ABYSS})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      if (closure < 1) {
        const lit = ctx.createLinearGradient(x + r * 0.8, y - r * 0.8, x - r * 0.4, y + r * 0.4);
        lit.addColorStop(0, `rgba(${DAWN}, ${0.2 * (1 - closure)})`);
        lit.addColorStop(0.5, `rgba(${DAWN}, ${0.03 * (1 - closure)})`);
        lit.addColorStop(1, `rgba(${DAWN}, 0)`);
        ctx.fillStyle = lit;
        ctx.fill();
      }

      const from = -Math.PI * 0.82 + closure * 2.2;
      ctx.lineWidth = 1.2 + throat * 1.6;
      ctx.strokeStyle = `rgba(${DAWN}, ${0.55 + 0.3 * closure})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0, r - 0.6), from, from + Math.PI * (0.9 + 1.1 * closure));
      ctx.stroke();
    };

    const drawBody = (theta, hx, hy, sw) => {
      const ring = geo.rings[BODY_RING];
      const pose = poses[BODY_RING];
      const fade = Math.min(1, pose.scale * 4);
      if (fade < 0.02) return;
      const segments = sw ? 18 : 10;
      const span = 0.34 + sw * 1.4;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      for (let i = 0; i < segments; i += 1) {
        const a0 = theta - span * ((i + 1) / segments);
        const a1 = theta - span * (i / segments);
        const p0 = pointOnRing(hx, hy, ring, a0, pose);
        const p1 = pointOnRing(hx, hy, ring, a1, pose);
        ctx.strokeStyle = `rgba(${DAWN}, ${0.5 * fade * (1 - i / segments)})`;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
      const head = pointOnRing(hx, hy, ring, theta, pose);
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 9);
      glow.addColorStop(0, `rgba(${DAWN}, ${0.45 * fade})`);
      glow.addColorStop(1, `rgba(${DAWN}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${DAWN}, ${fade})`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    };

    /** Two gold arms that spin up, wind tighter and collapse into the hole. */
    const drawArms = (sw, hx, hy, holeR) => {
      const alpha = smooth(sw / 0.2) * (1 - smooth((sw - 0.68) / 0.2));
      const inner = holeR * 0.9;
      const outer = inner + (armReach - inner) * (1 - sw * sw);
      if (alpha < 0.01 || outer <= inner) return;

      const grad = ctx.createRadialGradient(hx, hy, inner, hx, hy, outer);
      grad.addColorStop(0, `rgba(${DAWN}, ${0.95 * alpha})`);
      grad.addColorStop(0.55, `rgba(${DAWN}, ${0.4 * alpha})`);
      grad.addColorStop(1, `rgba(${DAWN}, 0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';

      const phase = 8 * sw * sw;
      const wind = 2.4 + 3.2 * sw;
      const ratio = outer / inner;
      for (let arm = 0; arm < 2; arm += 1) {
        ctx.beginPath();
        for (let i = 0; i <= ARM_SEGMENTS; i += 1) {
          const s = i / ARM_SEGMENTS;
          const r = inner * ratio ** s;
          const angle = phase + arm * Math.PI - wind * s;
          ctx.lineTo(hx + r * Math.cos(angle), hy + r * Math.sin(angle));
        }
        ctx.stroke();
      }
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

      const sw = swallow.active ? clamp01((time - swallow.start) / SWALLOW_MS) : 0;
      if (sw >= COVER_AT) {
        ctx.fillStyle = `rgb(${NOTES_RGB.join(', ')})`;
        ctx.fillRect(0, 0, width, height);
        return;
      }

      const hx = geo.cx + pointer.snx * 8;
      const hy = geo.cy + pointer.sny * 8;
      const dustX = pointer.snx * DUST_PARALLAX - DUST_MARGIN;
      const dustY = pointer.sny * DUST_PARALLAX - DUST_MARGIN;

      if (sw) {
        // The baked image cannot turn without baring its corners, so each speck moves on its own.
        paintVoid(
          ctx,
          width,
          height,
          geo.cx + dustX + DUST_MARGIN,
          geo.cy + dustY + DUST_MARGIN,
          Math.max(width, height) * 0.7,
        );
        const { dust } = backdrop;
        ctx.fillStyle = `rgb(${STARLIGHT})`;
        for (let i = 0; i < dust.length; i += 4) {
          swirl(dust[i] + dustX, dust[i + 1] + dustY, sw, hx, hy, swirlReach, spot);
          if (spot.left < 0.03) continue;
          ctx.globalAlpha = dust[i + 3] * Math.min(1, spot.left * 6);
          ctx.fillRect(spot.x, spot.y, dust[i + 2], dust[i + 2]);
        }
        ctx.strokeStyle = `rgb(${STARLIGHT})`;
        ctx.lineCap = 'round';
      } else {
        ctx.drawImage(backdrop.canvas, dustX, dustY, width + DUST_MARGIN * 2, height + DUST_MARGIN * 2);
      }

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
        if (sw) {
          smear(x, y, star.r, a, sw, hx, hy);
          return;
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
      if (sw) {
        for (let i = 0; i < reserve.length; i += 4) {
          smear(reserve[i], reserve[i + 1], reserve[i + 2], reserve[i + 3], sw, hx, hy);
        }
      }
      ctx.globalAlpha = 1;

      if (animated) drawMeteor(time);

      const light = presence * (0.35 + 0.65 * Math.min(1, pointer.energy));
      const lightGrad = light > 0.01 ? ringLight(light) : null;
      const cruise = animated ? BODY_PARKED + (time / BODY_PERIOD_MS) * Math.PI * 2 : BODY_PARKED;
      const theta = cruise + BODY_WHIP * sw * sw;
      const bodyInFront = Math.sin(theta) > 0;
      const targetScale = hoverRef.current ? HOVER_SCALE : 1;
      bodyScale += (targetScale - bodyScale) * (animated ? 0.14 : 1);

      const closure = smooth(sw / THROAT_AT);
      const throat = clamp01((sw - THROAT_AT) / (COVER_AT - THROAT_AT));
      const restRadius = geo.radius * bodyScale * (1 + 0.35 * closure);
      const coverRadius = Math.hypot(Math.max(hx, width - hx), Math.max(hy, height - hy)) + 2;
      const holeRadius = restRadius + (coverRadius - restRadius) * throat ** 2.4;

      poseRings(sw);
      if (sw) drawArms(sw, hx, hy, holeRadius);
      strokeRings(Math.PI, Math.PI * 2, hx, hy, lightGrad);
      if (!bodyInFront) drawBody(theta, hx, hy, sw);
      drawPlanet(hx, hy, holeRadius, closure, throat);
      if (!sw) placeWell(hx, hy, geo.radius, bodyScale);
      strokeRings(0, Math.PI, hx, hy, lightGrad);
      if (bodyInFront) drawBody(theta, hx, hy, sw);
    };

    const endSwallow = () => {
      window.clearTimeout(swallowTimer);
      swallow.active = false;
      html.removeAttribute('data-swallow');
      html.style.removeProperty('--hole-x');
      html.style.removeProperty('--hole-y');
    };

    enterRef.current = () => {
      if (swallow.active) return;
      if (!animated) {
        navigate('/notes');
        return;
      }
      if (!reserve.length) reserve = seedReserve(width, height, geo, stars.length);
      swallow.active = true;
      swallow.start = performance.now();
      html.style.setProperty('--hole-x', `${(geo.cx + pointer.snx * 8).toFixed(1)}px`);
      html.style.setProperty('--hole-y', `${(geo.cy + pointer.sny * 8).toFixed(1)}px`);
      html.dataset.swallow = '';
      // A timer, not the frame loop, so a tab that stops painting still leaves.
      swallowTimer = window.setTimeout(() => {
        endSwallow();
        navigate('/notes');
      }, SWALLOW_MS);
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
      enterRef.current = () => navigate('/notes');
      endSwallow();
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
          onClick={() => enterRef.current()}
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
