export function HorizonLimb() {
  return (
    <div className="horizon-limb pointer-events-none fixed inset-0 z-[3] overflow-hidden" aria-hidden="true">
      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[radial-gradient(ellipse_at_50%_120%,rgba(56,189,248,0.32)_0%,rgba(253,230,138,0.16)_26%,rgba(3,7,18,0)_64%)]" />
      <svg
        className="absolute inset-x-[-20%] bottom-[-26%] h-[52%] w-[140%]"
        viewBox="0 0 1400 420"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="limbBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0" />
            <stop offset="42%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="54%" stopColor="#fde68a" stopOpacity="0.9" />
            <stop offset="64%" stopColor="#fb923c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#030712" stopOpacity="1" />
          </linearGradient>
        </defs>
        <ellipse cx="700" cy="340" rx="860" ry="216" fill="#030712" />
        <ellipse cx="700" cy="328" rx="860" ry="228" fill="url(#limbBand)" />
        <ellipse
          cx="700"
          cy="318"
          rx="860"
          ry="228"
          fill="none"
          stroke="#fde68a"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
