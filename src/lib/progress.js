import { inkForProgress } from './color';

let lastInk = '';

export function applyProgress(progress, progressRef) {
  const clamped = Math.min(1, Math.max(0, progress));
  if (progressRef) progressRef.current = clamped;
  const doc = document.documentElement;
  doc.style.setProperty('--progress', clamped.toFixed(4));
  const { ink, muted } = inkForProgress(clamped);
  if (ink !== lastInk) {
    lastInk = ink;
    doc.style.setProperty('--chrome-ink', ink);
    doc.style.setProperty('--chrome-muted', muted);
  }
  return clamped;
}

export function scrollProgressFromY(scrollY) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? scrollY / max : 0;
}
