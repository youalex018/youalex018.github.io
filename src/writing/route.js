import { createElement, useSyncExternalStore } from 'react';

const ROUTE_EVENT = 'alex:route-change';

function subscribe(callback) {
  window.addEventListener('popstate', callback);
  window.addEventListener(ROUTE_EVENT, callback);

  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(ROUTE_EVENT, callback);
  };
}

function getPathname() {
  return window.location.pathname;
}

export function usePathname() {
  return useSyncExternalStore(subscribe, getPathname, () => '/');
}

export function navigate(to, { replace = false } = {}) {
  const url = new URL(to, window.location.href);
  if (url.origin !== window.location.origin) {
    window.location.assign(url.href);
    return;
  }

  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) return;

  window.history[replace ? 'replaceState' : 'pushState'](null, '', next);
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

export function RouteLink({ href, onClick, children, ...props }) {
  function handleClick(event) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === '_blank'
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
  }

  return createElement('a', { ...props, href, onClick: handleClick }, children);
}
