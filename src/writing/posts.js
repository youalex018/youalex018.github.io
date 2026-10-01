import { marked } from 'marked';

const sources = import.meta.glob('./posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: source };

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else if (value === 'true' || value === 'false') {
      value = value === 'true';
    }
    meta[key] = value;
  }

  return { meta, body: source.slice(match[0].length).trim() };
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}

export const posts = Object.entries(sources)
  .map(([path, source]) => {
    const { meta, body } = parseFrontmatter(source);
    return {
      slug: slugFromPath(path),
      title: meta.title ?? 'Untitled',
      date: meta.date ?? '',
      summary: meta.summary ?? '',
      epigraph: meta.epigraph ?? '',
      draft: meta.draft === true,
      html: marked.parse(body, { gfm: true }),
    };
  })
  .filter((post) => import.meta.env.DEV || !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug) {
  return posts.find((post) => post.slug === slug);
}

export function formatPostDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
