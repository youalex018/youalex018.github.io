export function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <div className="aurora-veil absolute inset-0">
        {/* The SVG (with its blur filter) is static; only this wrapper animates, so the
            filtered raster is cached and the drift runs on the compositor. */}
        <div className="drift-slow absolute -inset-[12%] will-change-transform">
          <svg className="h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="auroraGreen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
                <stop offset="45%" stopColor="#34d399" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="auroraViolet" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0" />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
              <filter id="auroraBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
            </defs>
            <g filter="url(#auroraBlur)">
              <path
                d="M80 640 C 200 420, 280 280, 420 220 S 640 260, 720 180 S 920 80, 1180 160"
                stroke="url(#auroraGreen)"
                strokeWidth="54"
                fill="none"
              />
              <path
                d="M40 700 C 260 480, 340 360, 500 300 S 760 340, 880 220 S 1040 140, 1220 240"
                stroke="url(#auroraViolet)"
                strokeWidth="70"
                fill="none"
              />
            </g>
          </svg>
        </div>

        <div className="absolute left-1/2 top-[28%] h-0 w-0">
          <div className="orbit-sat h-3 w-5 rounded-[2px] bg-slate-200/90 shadow-[0_0_12px_rgba(248,250,252,0.7)]">
            <span className="absolute top-1/2 left-1/2 h-px w-7 -translate-x-1/2 -translate-y-1/2 bg-slate-100/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
