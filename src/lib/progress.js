import { inkForProgress } from './color';

// Only the elements that read these values receive them. Writing them on the
// root would restyle the whole document on every scroll frame.
const progressSinks = document.getElementsByClassName('progress-sink');
const chromeSinks = document.getElementsByClassName('chrome-sink');
const written = new WeakMap();
const listeners = new Set();

let current = { value: '', ink: '', muted: '', progress: 0 };

function sinkState(el) {
  let state = written.get(el);
  if (!state) {
    const [from, to] = (el.dataset.range ?? '').split(' ').map(Number);
    state = { value: '', ink: '', parked: null, from, to, ranged: Boolean(el.dataset.range) };
    written.set(el, state);
  }
  return state;
}

function sync() {
  for (const el of progressSinks) {
    const state = sinkState(el);
    if (state.value !== current.value) {
      state.value = current.value;
      el.style.setProperty('--progress', current.value);
    }
    if (state.ranged) {
      const parked = current.progress <= state.from || current.progress >= state.to;
      if (parked !== state.parked) {
        state.parked = parked;
        el.classList.toggle('is-parked', parked);
      }
    }
  }
  for (const el of chromeSinks) {
    const state = sinkState(el);
    if (state.ink !== current.ink) {
      state.ink = current.ink;
      el.style.setProperty('--chrome-ink', current.ink);
      el.style.setProperty('--chrome-muted', current.muted);
    }
  }
}

export function applyProgress(progress, progressRef) {
  const clamped = Math.min(1, Math.max(0, progress));
  if (progressRef) progressRef.current = clamped;
  const { ink, muted } = inkForProgress(clamped);
  current = { value: clamped.toFixed(4), ink, muted, progress: clamped };
  sync();
  listeners.forEach((listener) => listener(clamped));
  return clamped;
}

export function subscribeProgress(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Ascent climbs upward: the top of the page is the exosphere (progress 1) and
// the bottom is the troposphere (progress 0), so progress falls as scrollY grows.
export function scrollProgressFromY(scrollY) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? 1 - scrollY / max : 0;
}

export function scrollYFromProgress(progress) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return (1 - Math.min(1, Math.max(0, progress))) * Math.max(0, max);
}
