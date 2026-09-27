const STARS = [
  [40, 48, 0.7],
  [78, 110, 0.5],
  [120, 36, 0.9],
  [168, 72, 0.5],
  [250, 40, 0.6],
  [310, 78, 0.8],
  [360, 34, 0.5],
  [520, 58, 0.7],
  [580, 96, 1],
  [70, 180, 0.5],
  [48, 250, 0.8],
  [110, 300, 0.6],
  [150, 340, 0.5],
  [300, 330, 0.7],
  [360, 360, 0.5],
  [500, 250, 0.6],
  [560, 210, 0.9],
  [600, 300, 0.5],
  [540, 340, 0.7],
  [200, 150, 0.5],
  [470, 180, 0.6],
  [390, 150, 0.5],
  [270, 250, 0.8],
  [90, 210, 1.1],
  [610, 170, 0.5],
];

function Arms({ stroke }) {
  return (
    <g fill="none" stroke={stroke} strokeLinecap="round">
      <path d="M8 0 C 30 -20, 62 -24, 92 -4" strokeWidth="1.7" strokeOpacity="0.6" />
      <path d="M-8 0 C -30 20, -62 24, -92 4" strokeWidth="1.7" strokeOpacity="0.6" />
      <path d="M16 6 C 42 -2, 68 10, 96 22" strokeWidth="0.8" strokeOpacity="0.35" />
      <path d="M-16 -6 C -42 2, -68 -10, -96 -22" strokeWidth="0.8" strokeOpacity="0.35" />
    </g>
  );
}

function Body({ tilt, halo, disc, arm, core, spin }) {
  return (
    <g className={spin}>
      <ellipse rx={halo[0]} ry={halo[1]} fill={disc[2]} transform={`rotate(${tilt})`} />
      <ellipse rx={disc[0]} ry={disc[1]} fill={disc[2]} transform={`rotate(${tilt})`} />
      <g transform={`rotate(${tilt})`}>
        <Arms stroke={arm} />
      </g>
      <circle r="11" fill={core} fillOpacity="0.28" />
      <circle r="3.1" fill={core} />
    </g>
  );
}

export function Galaxy() {
  return (
    <div className="galaxy relative aspect-[5/3] overflow-hidden rounded-2xl">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="clusterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#312e81" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#1e1b4b" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#070b16" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="galaxyMain" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="16%" stopColor="#fde68a" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#c4b5fd" stopOpacity="0.5" />
            <stop offset="68%" stopColor="#4338ca" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#070b16" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="galaxyBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="18%" stopColor="#7dd3fc" stopOpacity="0.9" />
            <stop offset="48%" stopColor="#1d4ed8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#070b16" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="galaxyAmber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="22%" stopColor="#fdba74" stopOpacity="0.85" />
            <stop offset="58%" stopColor="#c2410c" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#070b16" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="300" cy="200" rx="230" ry="120" fill="url(#clusterGlow)" />
        {STARS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#f8fafc" fillOpacity={r > 0.9 ? 0.9 : 0.45} />
        ))}

        <g transform="translate(230 205)">
          <Body
            tilt={-24}
            halo={[150, 78]}
            disc={[108, 40, 'url(#galaxyMain)']}
            arm="#e0e7ff"
            core="#fff7ed"
            spin="galaxy-spin"
          />
        </g>
        <g transform="translate(455 125)">
          <Body
            tilt={38}
            halo={[96, 62]}
            disc={[72, 46, 'url(#galaxyBlue)']}
            arm="#bae6fd"
            core="#f8fafc"
            spin="galaxy-spin galaxy-spin-slow"
          />
        </g>
        <g transform="translate(430 292)">
          <Body
            tilt={14}
            halo={[70, 36]}
            disc={[52, 22, 'url(#galaxyAmber)']}
            arm="#fde68a"
            core="#fff7ed"
            spin="galaxy-spin galaxy-spin-fast"
          />
        </g>
      </svg>
      <p className="pointer-events-none absolute top-3 left-4 m-0 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-slate-300/80">
        Local group
      </p>
    </div>
  );
}
