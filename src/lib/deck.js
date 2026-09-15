export function projectsToDeck(items) {
  return items.map((item, index) => ({
    id: item.id,
    index,
    kind: 'project',
    eyebrow: item.year,
    headline: item.title,
    secondary: item.kicker,
    description: item.summary,
    bullets: item.impact ? [item.impact] : [],
    tags: item.tech ?? [],
    image: item.image ?? null,
    links: [
      item.demoUrl ? { label: 'Live demo', href: item.demoUrl } : null,
      item.repoUrl ? { label: 'Repo', href: item.repoUrl, icon: 'github' } : null,
    ].filter(Boolean),
  }));
}

export function timelineToDeck(items) {
  return items.map((item, index) => ({
    id: item.id,
    index,
    kind: 'experience',
    eyebrow: item.date,
    headline: item.org,
    secondary: item.role,
    description: item.highlights?.[0] ?? null,
    bullets: [],
    tags: [],
    image: item.image ?? null,
    links: [],
  }));
}
