// Soft edges come from the gradient falloff itself; no filter: blur() so the
// layer rasterizes once and only its opacity changes on scroll.
export function Nebula() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <div className="nebula-field absolute inset-0">
        <div className="absolute left-[2%] top-[10%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.2)_0%,rgba(244,114,182,0.08)_30%,rgba(30,27,75,0)_62%)]" />
        <div className="absolute right-[-4%] top-[0%] h-[62vh] w-[62vh] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16)_0%,rgba(56,189,248,0.06)_30%,rgba(3,7,18,0)_60%)]" />
        <div className="absolute bottom-[0%] left-[26%] h-[56vh] w-[74vh] rounded-full bg-[radial-gradient(ellipse,rgba(167,139,250,0.18)_0%,rgba(167,139,250,0.07)_32%,rgba(3,7,18,0)_62%)]" />
      </div>
    </div>
  );
}
