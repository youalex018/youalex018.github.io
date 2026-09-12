export function projectsToDeck(items) {
  return items.map((item, index) => ({
    id: item.id,
    index,
    eyebrow: `${item.year} · ${item.kicker}`,
    title: item.title,
    subtitle: item.kicker,
    body: item.summary,
    bullets: item.impact ? [item.impact] : [],
    tags: item.tech ?? [],
    image: item.image ?? null,
    links: [
      item.demoUrl ? { label: 'Live demo', href: item.demoUrl } : null,
      item.repoUrl ? { label: 'Repository', href: item.repoUrl, icon: 'github' } : null,
    ].filter(Boolean),
  }));
}

export function timelineToDeck(items) {
  return items.map((item, index) => ({
    id: item.id,
    index,
    eyebrow: item.date,
    title: item.role,
    subtitle: item.org,
    body: null,
    bullets: item.highlights ?? [],
    tags: [],
    image: item.image ?? null,
    links: [],
  }));
}
