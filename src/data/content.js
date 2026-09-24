import profileFallback from './fallbacks/profile.json';
import projectsFallback from './fallbacks/projects.json';
import socialsFallback from './fallbacks/socials.json';
import timelineFallback from './fallbacks/timeline.json';

const local = import.meta.glob(
  ['./profile.json', './projects.json', './socials.json', './timeline.json'],
  { eager: true, import: 'default' },
);

export const profile = local['./profile.json'] ?? profileFallback;
export const projects = local['./projects.json'] ?? projectsFallback;
export const socials = local['./socials.json'] ?? socialsFallback;
export const timeline = local['./timeline.json'] ?? timelineFallback;
