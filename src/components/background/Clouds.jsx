// Stacked-puff SVG silhouettes — overlapping ellipses with a hard-ish
// silhouette, no filter:blur. Bands are 200% wide so the loop is seamless.

const VARIANTS = {
  a: [
    { cx: 48, cy: 58, rx: 38, ry: 26 },
    { cx: 88, cy: 42, rx: 36, ry: 32 },
    { cx: 128, cy: 36, rx: 40, ry: 34 },
    { cx: 168, cy: 48, rx: 34, ry: 28 },
    { cx: 198, cy: 62, rx: 30, ry: 22 },
    { cx: 108, cy: 68, rx: 78, ry: 22 },
  ],
  b: [
    { cx: 42, cy: 52, rx: 32, ry: 24 },
    { cx: 78, cy: 34, rx: 38, ry: 30 },
    { cx: 118, cy: 40, rx: 34, ry: 28 },
    { cx: 154, cy: 50, rx: 30, ry: 24 },
    { cx: 96, cy: 64, rx: 72, ry: 20 },
  ],
  c: [
    { cx: 54, cy: 50, rx: 28, ry: 22 },
    { cx: 86, cy: 32, rx: 34, ry: 28 },
    { cx: 126, cy: 28, rx: 36, ry: 30 },
    { cx: 164, cy: 44, rx: 32, ry: 24 },
    { cx: 188, cy: 58, rx: 26, ry: 18 },
    { cx: 112, cy: 62, rx: 84, ry: 20 },
  ],
  d: [
    { cx: 50, cy: 46, rx: 30, ry: 22 },
    { cx: 92, cy: 30, rx: 40, ry: 28 },
    { cx: 148, cy: 38, rx: 36, ry: 26 },
    { cx: 100, cy: 58, rx: 70, ry: 22 },
  ],
};

const TOP = [
  { left: -4, top: 6, w: 34, variant: 'c' },
  { left: 22, top: 2, w: 28, variant: 'b' },
  { left: 48, top: 8, w: 36, variant: 'a' },
  { left: 74, top: 4, w: 30, variant: 'd' },
  { left: 92, top: 14, w: 26, variant: 'b' },
];

const MID = [
  { left: 4, top: 28, w: 32, variant: 'a' },
  { left: 34, top: 36, w: 26, variant: 'd' },
  { left: 58, top: 24, w: 30, variant: 'b' },
  { left: 82, top: 32, w: 28, variant: 'c' },
];

const LOW = [
  { left: -6, top: 54, w: 38, variant: 'a' },
  { left: 28, top: 62, w: 34, variant: 'c' },
  { left: 60, top: 52, w: 40, variant: 'b' },
  { left: 88, top: 58, w: 32, variant: 'd' },
];

const STRATO_FLUFF = [
  { left: 10, top: 14, w: 24, variant: 'b' },
  { left: 38, top: 40, w: 22, variant: 'd' },
  { left: 64, top: 8, w: 26, variant: 'c' },
  { left: 88, top: 32, w: 20, variant: 'd' },
];

const STRATO_WISP = [
  { left: 8, top: 22, w: 44 },
  { left: 44, top: 54, w: 40 },
  { left: 76, top: 18, w: 38 },
];

const MESO_FLUFF = [
  { left: 6, top: 16, w: 22, variant: 'd' },
  { left: 32, top: 44, w: 26, variant: 'b' },
  { left: 58, top: 10, w: 20, variant: 'd' },
  { left: 78, top: 36, w: 24, variant: 'c' },
];

const MESO_WISP = [
  { left: 0, top: 26, w: 42 },
  { left: 38, top: 62, w: 48 },
  { left: 70, top: 20, w: 36 },
];

function Cumulus({ variant, className, style, fill = 'url(#cumulusLit)', shade = 'url(#cumulusShade)' }) {
  const puffs = VARIANTS[variant];
  return (
    <svg
      className={`cumulus ${className ?? ''}`}
      style={style}
      viewBox="0 0 230 90"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <g fill={fill}>
        {puffs.map((puff, i) => (
          <ellipse key={i} cx={puff.cx} cy={puff.cy} rx={puff.rx} ry={puff.ry} />
        ))}
      </g>
      <ellipse cx="115" cy="78" rx="86" ry="12" fill={shade} />
    </svg>
  );
}

function Wisp({ style, fill = 'url(#mesoWisp)' }) {
  return (
    <svg className="cumulus" style={style} viewBox="0 0 280 42" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <ellipse cx="68" cy="24" rx="54" ry="11" fill={fill} />
      <ellipse cx="132" cy="18" rx="62" ry="13" fill={fill} />
      <ellipse cx="198" cy="24" rx="50" ry="10" fill={fill} />
    </svg>
  );
}

function CloudSet({ clouds, kind = 'cumulus', fill, shade, wispFill }) {
  return (
    <div className="relative h-full w-1/2 shrink-0">
      {clouds.map((cloud, index) =>
        kind === 'wisp' ? (
          <Wisp
            key={index}
            fill={wispFill}
            style={{
              left: `${cloud.left}%`,
              top: `${cloud.top}%`,
              width: `${cloud.w}vw`,
            }}
          />
        ) : (
          <Cumulus
            key={index}
            variant={cloud.variant}
            fill={fill}
            shade={shade}
            style={{
              left: `${cloud.left}%`,
              top: `${cloud.top}%`,
              width: `${cloud.w}vw`,
            }}
          />
        ),
      )}
    </div>
  );
}

function CloudBand({ clouds, speed, wrapperClass, kind = 'cumulus', fill, shade, wispFill }) {
  return (
    <div className={`absolute inset-0 ${wrapperClass}`}>
      <div className={`cloud-band ${speed}`}>
        <CloudSet clouds={clouds} kind={kind} fill={fill} shade={shade} wispFill={wispFill} />
        <CloudSet clouds={clouds} kind={kind} fill={fill} shade={shade} wispFill={wispFill} />
      </div>
    </div>
  );
}

export function Clouds() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <linearGradient id="cumulusLit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="62%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id="cumulusShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="stratoLit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#e0f2fe" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="stratoShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="stratoWisp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mesoLit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.78" />
            <stop offset="55%" stopColor="#c4b5fd" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="mesoShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="mesoWisp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0" />
            <stop offset="35%" stopColor="#e0e7ff" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#c4b5fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="sun-orb absolute -right-[6%] top-[6%] h-[44vw] w-[44vw] max-h-[32rem] max-w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,241,190,1)_0%,rgba(253,224,71,0.75)_22%,rgba(251,146,60,0.42)_46%,transparent_72%)]" />

      <CloudBand clouds={TOP} speed="cloud-speed-far" wrapperClass="cloud-top" />
      <CloudBand clouds={MID} speed="cloud-speed-mid" wrapperClass="cloud-mid" />
      <CloudBand clouds={LOW} speed="cloud-speed-near" wrapperClass="cloud-near" />
      <CloudBand
        clouds={STRATO_FLUFF}
        speed="cloud-speed-strato"
        wrapperClass="cloud-strato"
        fill="url(#stratoLit)"
        shade="url(#stratoShade)"
      />
      <CloudBand
        clouds={STRATO_WISP}
        speed="cloud-speed-strato-wisp"
        wrapperClass="cloud-strato-wisp"
        kind="wisp"
        wispFill="url(#stratoWisp)"
      />
      <CloudBand
        clouds={MESO_FLUFF}
        speed="cloud-speed-meso"
        wrapperClass="cloud-meso"
        fill="url(#mesoLit)"
        shade="url(#mesoShade)"
      />
      <CloudBand clouds={MESO_WISP} speed="cloud-speed-meso-wisp" wrapperClass="cloud-meso-wisp" kind="wisp" />

      <svg
        className="cirrus absolute left-[-10%] top-[16%] h-[40%] w-[120%] text-white"
        viewBox="0 0 1200 400"
        fill="none"
      >
        <path
          d="M-20 120 C 180 80, 260 160, 460 110 S 780 40, 980 90 S 1180 150, 1280 120"
          stroke="currentColor"
          strokeOpacity="0.32"
          strokeWidth="1.6"
        />
        <path
          d="M-40 180 C 140 150, 300 210, 520 170 S 820 110, 1040 160 S 1220 210, 1320 180"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1.2"
        />
        <path
          d="M0 70 C 220 30, 340 90, 560 50 S 860 0, 1100 60"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
      </svg>

      <svg
        className="horizon-arc absolute inset-x-[-20%] bottom-[-28%] h-[55%] w-[140%] text-sky-900/25"
        viewBox="0 0 1400 500"
        fill="none"
      >
        <ellipse
          cx="700"
          cy="420"
          rx="780"
          ry="220"
          fill="url(#horizonFill)"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <defs>
          <linearGradient id="horizonFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.08" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
