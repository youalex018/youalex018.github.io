function hexToRgb(hex) {
  const n = hex.replace('#', '');
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ];
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function lerpColor(from, to, t) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const clamped = Math.min(1, Math.max(0, t));
  const r = Math.round(lerp(a[0], b[0], clamped));
  const g = Math.round(lerp(a[1], b[1], clamped));
  const bl = Math.round(lerp(a[2], b[2], clamped));
  return `rgb(${r} ${g} ${bl})`;
}

export function inkForProgress(progress) {
  const t = Math.min(1, Math.max(0, (progress - 0.5) / 0.12));
  return {
    ink: lerpColor('#1c1917', '#f8fafc', t),
    muted: lerpColor('#44403c', '#e2e8f0', t),
  };
}
