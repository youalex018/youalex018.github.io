import { useMemo, useRef, useState } from 'react';

const STARS = [
  { x: 18, y: 38 },
  { x: 32, y: 24 },
  { x: 48, y: 32 },
  { x: 61, y: 16 },
  { x: 74, y: 28 },
  { x: 86, y: 12 },
  { x: 28, y: 48 },
  { x: 70, y: 44 },
];

const EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [2, 4],
  [0, 6],
  [4, 7],
];

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

export function Constellation() {
  const wrapRef = useRef(null);
  const [cursor, setCursor] = useState(null);
  const [lit, setLit] = useState(false);

  const activeEdges = useMemo(() => {
    if (!cursor) return [];
    return EDGES.filter(([a, b]) => {
      const starA = STARS[a];
      const starB = STARS[b];
      return dist(cursor.x, cursor.y, starA.x, starA.y) < 18 || dist(cursor.x, cursor.y, starB.x, starB.y) < 18;
    });
  }, [cursor]);

  function onMove(event) {
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    setCursor({
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 60,
    });
    setLit(true);
  }

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[5/3] overflow-hidden rounded-2xl border border-white/10 bg-black/25"
      onPointerMove={onMove}
      onPointerEnter={() => setLit(true)}
      onPointerLeave={() => {
        setLit(false);
        setCursor(null);
      }}
    >
      <svg className="h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {EDGES.map(([a, b]) => {
          const on = activeEdges.some((edge) => edge[0] === a && edge[1] === b);
          return (
            <line
              key={`${a}-${b}`}
              x1={STARS[a].x}
              y1={STARS[a].y}
              x2={STARS[b].x}
              y2={STARS[b].y}
              stroke="#e2e8f0"
              strokeWidth="0.35"
              strokeOpacity={on ? 0.85 : 0.08}
            />
          );
        })}
        {STARS.map((star, index) => (
          <circle
            key={index}
            cx={star.x}
            cy={star.y}
            r={lit ? 1.15 : 0.85}
            fill="#f8fafc"
            fillOpacity={0.9}
          />
        ))}
      </svg>
      <p className="pointer-events-none absolute bottom-3 left-3 m-0 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-slate-300/80">
        {lit ? 'Vulpecula, the little fox' : 'Hover the field'}
      </p>
    </div>
  );
}
