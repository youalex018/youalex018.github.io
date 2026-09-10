import { useEffect, useState } from 'react';
import { LAYER_IDS } from '../data/layers';

export function useActiveLayer(ids = LAYER_IDS) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });
        let bestId = ids[0];
        let bestRatio = -1;
        ids.forEach((id) => {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestRatio > 0) setActive(bestId);
      },
      {
        threshold: [0.15, 0.3, 0.45, 0.6, 0.75],
        rootMargin: '-12% 0px -18% 0px',
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
