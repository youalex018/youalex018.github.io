export function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <div className="aurora-veil progress-sink absolute inset-0" data-range="0.52 0.88">
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
      </div>
    </div>
  );
}
