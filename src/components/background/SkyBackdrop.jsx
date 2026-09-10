const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

export function SkyBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="sky-strip" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: NOISE,
          opacity: 'calc(0.04 + var(--progress) * 0.1)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 52%, rgb(0 0 0 / 0.22) 100%)',
          opacity: 'calc(0.1 + var(--progress) * 0.5)',
        }}
      />
    </div>
  );
}
