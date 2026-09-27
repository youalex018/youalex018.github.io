import { useEffect, useRef } from 'react';
import { subscribeProgress } from '../../lib/progress';

const ALPHA_STEPS = 16;
// Twinkle doesn't need more than ~60–72 fps; high-refresh screens skip frames.
const MIN_FRAME_MS = 13;

function starCount(width, height, isMobile) {
  const area = width * height;
  const base = Math.round(area / 4200);
  const count = Math.min(400, Math.max(120, base));
  return isMobile ? Math.round(count * 0.5) : count;
}

function seedStars(width, height, count) {
  const stars = [];
  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.35 + 0.15,
      tw: Math.random() * Math.PI * 2,
      sp: 0.35 + Math.random() * 1.4,
      bright: 0.35 + Math.random() * 0.65,
      depth: 0.35 + Math.random() * 0.65,
    });
  }
  return stars;
}

function starAlphaFor(progress) {
  return Math.min(1, Math.max(0, (progress - 0.32) / 0.42));
}

export function Starfield({ progressRef, reduced, paused = false }) {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || paused) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let stars = [];
    let meteors = [];
    let frame = 0;
    let lastDraw = 0;
    let blank = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const isMobile = window.matchMedia('(max-width: 640px)').matches;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = seedStars(width, height, starCount(width, height, isMobile));
      blank = false;
    };

    const spawnMeteor = (progress) => {
      if (progress < 0.4 || progress > 0.68) return;
      if (Math.random() > 0.018) return;
      meteors.push({
        x: Math.random() * width * 0.85,
        y: Math.random() * height * 0.35,
        vx: 5.5 + Math.random() * 7,
        vy: 7 + Math.random() * 8,
        life: 1,
        len: 48 + Math.random() * 70,
      });
    };

    const paintStars = (time, starAlpha) => {
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      pointerRef.current.x += (pointerRef.current.tx - px) * 0.1;
      pointerRef.current.y += (pointerRef.current.ty - py) * 0.1;

      // One path per brightness step instead of one fill per star.
      const paths = Array.from({ length: ALPHA_STEPS }, () => new Path2D());
      stars.forEach((star) => {
        const twinkle = reduced ? 1 : 0.55 + 0.45 * Math.sin(time * 0.0018 * star.sp + star.tw);
        const step = Math.min(ALPHA_STEPS - 1, Math.floor(star.bright * twinkle * ALPHA_STEPS));
        const x = star.x + (reduced ? 0 : px * star.depth * 18);
        const y = star.y + (reduced ? 0 : py * star.depth * 14);
        paths[step].moveTo(x + star.r, y);
        paths[step].arc(x, y, star.r, 0, Math.PI * 2);
      });

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = '#f8fafc';
      paths.forEach((path, step) => {
        ctx.globalAlpha = starAlpha * ((step + 0.5) / ALPHA_STEPS);
        ctx.fill(path);
      });
      ctx.restore();
    };

    const paintMeteors = () => {
      meteors.forEach((meteor) => {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life -= 0.018;
        const tailX = meteor.x - meteor.vx * (meteor.len / 10);
        const tailY = meteor.y - meteor.vy * (meteor.len / 10);
        const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.4, 'rgba(196, 181, 253, 0.45)');
        grad.addColorStop(1, 'rgba(196, 181, 253, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      });
      meteors = meteors.filter(
        (meteor) => meteor.life > 0 && meteor.x < width + 40 && meteor.y < height + 40,
      );
    };

    // Returns whether anything is left to animate.
    const draw = (time) => {
      const progress = progressRef.current ?? 0;
      const starAlpha = starAlphaFor(progress);
      const visible = starAlpha > 0.01;

      if (!visible && !meteors.length) {
        if (!blank) {
          ctx.clearRect(0, 0, width, height);
          blank = true;
        }
        return false;
      }

      blank = false;
      ctx.clearRect(0, 0, width, height);
      if (visible) paintStars(time, starAlpha);
      if (!reduced) {
        spawnMeteor(progress);
        paintMeteors();
      }
      return !reduced;
    };

    const loop = (time) => {
      frame = 0;
      if (time - lastDraw < MIN_FRAME_MS) {
        frame = requestAnimationFrame(loop);
        return;
      }
      lastDraw = time;
      if (draw(time)) frame = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (document.hidden) return;
      if (reduced) {
        draw(0);
        return;
      }
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onPointer = (event) => {
      pointerRef.current.tx = event.clientX / width - 0.5;
      pointerRef.current.ty = event.clientY / height - 0.5;
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      wake();
    };

    const onResize = () => {
      resize();
      wake();
    };

    resize();
    wake();
    const unsubscribe = subscribeProgress(wake);

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [progressRef, reduced, paused]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden="true"
    />
  );
}
