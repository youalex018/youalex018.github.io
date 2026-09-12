export const MODES = {
  ASCENT: 'ascent',
  ORBIT: 'orbit',
};

export const TABS = {
  PROJECTS: 'projects',
  EXPERIENCE: 'experience',
};

export const DEFAULT_MODE = MODES.ORBIT;
export const STORAGE_KEY = 'alex:view-mode';
export const URL_PARAM = 'view';

/** Pin the sky camera at the thermosphere / exosphere boundary. */
export const COCKPIT_PROGRESS = 0.82;

export const LAYER_TO_TAB = {
  mesosphere: TABS.PROJECTS,
  thermosphere: TABS.EXPERIENCE,
};

export function isValidMode(value) {
  return value === MODES.ASCENT || value === MODES.ORBIT;
}

export function readModeFromSearch(search) {
  const params = new URLSearchParams(search);
  const value = params.get(URL_PARAM);
  return isValidMode(value) ? value : null;
}

export function resolveInitialMode() {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  const fromUrl = readModeFromSearch(window.location.search);
  if (fromUrl) return fromUrl;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isValidMode(stored)) return stored;
  } catch {
    /* private mode */
  }
  return DEFAULT_MODE;
}

export function tabFromHash(hash) {
  const id = (hash ?? '').replace('#', '');
  return LAYER_TO_TAB[id] ?? TABS.PROJECTS;
}

export function persistMode(mode) {
  if (typeof window === 'undefined' || !isValidMode(mode)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* private mode */
  }
  const url = new URL(window.location.href);
  url.searchParams.set(URL_PARAM, mode);
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}
