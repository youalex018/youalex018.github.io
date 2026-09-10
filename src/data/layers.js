export const LAYERS = [
  {
    id: 'troposphere',
    label: 'Troposphere',
    section: 'Introduction',
    km: [0, 12],
    theme: 'light',
    progress: [0, 0.2],
  },
  {
    id: 'stratosphere',
    label: 'Stratosphere',
    section: 'About',
    km: [12, 50],
    theme: 'light',
    progress: [0.2, 0.4],
  },
  {
    id: 'mesosphere',
    label: 'Mesosphere',
    section: 'Projects',
    km: [50, 85],
    theme: 'dark',
    progress: [0.4, 0.6],
  },
  {
    id: 'thermosphere',
    label: 'Thermosphere',
    section: 'Experience',
    km: [85, 600],
    theme: 'dark',
    progress: [0.6, 0.8],
  },
  {
    id: 'exosphere',
    label: 'Exosphere',
    section: 'Contact',
    km: [600, 10000],
    theme: 'dark',
    progress: [0.8, 1],
  },
];

export const LAYER_IDS = LAYERS.map((layer) => layer.id);
