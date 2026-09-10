import { useEffect, useRef } from 'react';

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

export function Starfield({ progressRef, reduced }) {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let stars = [];
    let meteors = [];
    let frame = 0;
    let running = true;
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

    const draw = (time) => {
      if (!running) return;
      const progress = progressRef.current ?? 0;
      const starAlpha = Math.min(1, Math.max(0, (progress - 0.32) / 0.42));
      ctx.clearRect(0, 0, width, height);

      if (starAlpha > 0.01) {
        const px = pointerRef.current.x;
        const py = pointerRef.current.y;
        pointerRef.current.x += (pointerRef.current.tx - px) * 0.06;
        pointerRef.current.y += (pointerRef.current.ty - py) * 0.06;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        stars.forEach((star) => {
          const twinkle = reduced
            ? 1
            : 0.55 + 0.45 * Math.sin(time * 0.0018 * star.sp + star.tw);
          const ox = reduced ? 0 : px * star.depth * 18;
          const oy = reduced ? 0 : py * star.depth * 14;
          ctx.globalAlpha = starAlpha * star.bright * twinkle;
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.arc(star.x + ox, star.y + oy, star.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      if (!reduced) spawnMeteor(progress);

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

      if (!reduced && !document.hidden) {
        frame = requestAnimationFrame(draw);
      }
    };

    const onPointer = (event) => {
      pointerRef.current.tx = event.clientX / width - 0.5;
      pointerRef.current.ty = event.clientY / height - 0.5;
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
        return;
      }
      running = true;
      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };

    const onScroll = () => {
      if (!reduced) return;
      draw(0);
    };

    resize();
    if (reduced) {
      draw(0);
    } else {
      frame = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [progressRef, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden="true"
    />
  );
}
