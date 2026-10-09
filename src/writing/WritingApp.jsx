import { useEffect, useLayoutEffect } from 'react';
import { CloudLogo } from '../components/chrome/CloudLogo';
import { URL_PARAM } from '../data/modes';
import { formatPostDate, getPost, posts } from './posts';
import { RouteLink, usePathname } from './route';
import './writing.css';

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H6" />
      <path d="M11 7 6 12l5 5" />
    </svg>
  );
}

function WritingHeader({ back = false }) {
  return (
    <header className="writing-header">
      <nav className="writing-nav" aria-label="Notes">
        {back ? (
          <RouteLink className="writing-back focus-ring" href="/notes" aria-label="Back to notes">
            <BackArrow />
          </RouteLink>
        ) : null}
        <RouteLink className="writing-brand focus-ring" href="/" aria-label="Alex You, portfolio">
          <CloudLogo size={28} />
          <span>Alex You</span>
        </RouteLink>
      </nav>
    </header>
  );
}

function WritingIndex() {
  useEffect(() => {
    document.title = 'Alex You | Notes';
  }, []);

  return (
    <main className="writing-index" id="writing-main">
      <div className="writing-index-intro">
        <h1>Notes</h1>
        <p>{`Stuff I write when I should be locked in...\n`}
          {`Locking in currently`}
        </p>
      </div>

      <div className="writing-list-scroll">
        <ol className="writing-list">
          {posts.map((post, index) => (
            <li key={post.slug}>
              <RouteLink className="writing-card focus-ring" href={`/notes/${post.slug}`}>
                <span className="writing-card-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="writing-card-copy">
                  <span className="writing-card-meta">
                    <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  </span>
                  <span className="writing-card-title">{post.title}</span>
                  <span className="writing-card-summary">{post.summary}</span>
                </span>
                <span className="writing-card-arrow" aria-hidden="true">↗</span>
              </RouteLink>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}

function Article({ post }) {
  useEffect(() => {
    document.title = `${post.title} · Alex You`;
  }, [post.title]);

  return (
    <main className="article-shell" id="writing-main">
      <article>
        <header className="article-header">
          <p className="article-meta">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          </p>
          <h1>{post.title}</h1>
          {post.epigraph ? <p className="article-epigraph">{post.epigraph}</p> : null}
        </header>
        <div className="article-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        <footer className="article-footer">
          <RouteLink className="focus-ring" href="/notes">Back to notes</RouteLink>
        </footer>
      </article>
    </main>
  );
}

function MissingPiece() {
  useEffect(() => {
    document.title = 'Missing piece · Alex You';
  }, []);

  return (
    <main className="writing-missing" id="writing-main">
      <p className="writing-kicker">Signal lost · 404</p>
      <h1>This piece drifted out of range</h1>
      <RouteLink className="writing-back-link focus-ring" href="/notes">
        Return to notes
      </RouteLink>
    </main>
  );
}

export default function WritingApp({ entering = false }) {
  const pathname = usePathname();
  const slug = pathname.replace(/^\/notes\/?/, '').replace(/\/$/, '');
  const post = slug ? getPost(decodeURIComponent(slug)) : null;

  useLayoutEffect(() => {
    document.documentElement.dataset.surface = 'writing';
    const url = new URL(window.location.href);
    if (url.searchParams.has(URL_PARAM)) {
      url.searchParams.delete(URL_PARAM);
      const search = url.searchParams.toString();
      window.history.replaceState(null, '', `${url.pathname}${search ? `?${search}` : ''}${url.hash}`);
    }
    return () => {
      delete document.documentElement.dataset.surface;
      document.title = 'Alex You | Portfolio';
    };
  }, []);

  useLayoutEffect(() => {
    document.querySelector('.writing-list-scroll, .article-shell, .writing-missing')?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="writing-room" data-theme="dark">
      <a className="skip-link" href="#writing-main">Skip to content</a>
      <WritingHeader back={Boolean(slug)} />
      <div className={entering ? 'writing-stage writing-rise' : 'writing-stage'}>
        {slug ? (post ? <Article post={post} /> : <MissingPiece />) : <WritingIndex />}
      </div>
    </div>
  );
}
