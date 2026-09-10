import { LAYERS } from '../data/layers';

export function progressToAltitude(progress) {
  const p = Math.min(1, Math.max(0, progress));
  const band = LAYERS.find((layer) => p <= layer.progress[1]) ?? LAYERS[LAYERS.length - 1];
  const [p0, p1] = band.progress;
  const [a0, a1] = band.km;
  const t = p1 === p0 ? 1 : (p - p0) / (p1 - p0);
  return a0 + (a1 - a0) * t;
}

export function formatAltitude(km) {
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km).toLocaleString('en-US')} km`;
}

export function layerForProgress(progress) {
  const p = Math.min(1, Math.max(0, progress));
  return LAYERS.find((layer) => p <= layer.progress[1]) ?? LAYERS[LAYERS.length - 1];
}
