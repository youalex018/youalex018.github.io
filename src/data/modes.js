export const MODES = {
  ASCENT: 'ascent',
  ORBIT: 'orbit',
};

export const TABS = {
  PROJECTS: 'projects',
  EXPERIENCE: 'experience',
};

export const DEFAULT_MODE = MODES.ORBIT;

/** Ascent stays in the codebase, but the site opens in orbit until it returns. */
export const ASCENT_ENABLED = false;
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
  if (!ASCENT_ENABLED || typeof window === 'undefined') return DEFAULT_MODE;
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
  return LAYER_TO_TAB[id] ?? TABS.EXPERIENCE;
}

export function persistMode(mode) {
  if (typeof window === 'undefined' || !isValidMode(mode)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* private mode */
  }

  const url = new URL(window.location.href);
  const onWriting = url.pathname === '/notes' || url.pathname.startsWith('/notes/');
  // Orbit is the default, so the address stays bare. Notes is /notes.
  const showInUrl = ASCENT_ENABLED && !onWriting && mode !== DEFAULT_MODE;

  if (showInUrl) {
    if (url.searchParams.get(URL_PARAM) === mode) return;
    url.searchParams.set(URL_PARAM, mode);
  } else if (url.searchParams.has(URL_PARAM)) {
    url.searchParams.delete(URL_PARAM);
  } else {
    return;
  }

  const search = url.searchParams.toString();
  const next = `${url.pathname}${search ? `?${search}` : ''}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    window.history.replaceState(null, '', next);
  }
}
