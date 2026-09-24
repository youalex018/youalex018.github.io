import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function useFinePointer() {
  const [fine, setFine] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return fine;
}

export function ProjectPreview({
  image,
  imageAlt = '',
  video,
  objectPosition = 'center',
  className = '',
}) {
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const videoRef = useRef(null);
  const playGen = useRef(0);
  const [live, setLive] = useState(false);

  const canPlay = Boolean(video) && !reduced;

  const stop = useCallback(() => {
    playGen.current += 1;
    setLive(false);
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    try {
      el.currentTime = 0;
    } catch {
      /* metadata not ready */
    }
  }, []);

  const start = useCallback(() => {
    if (!canPlay) return;
    const gen = ++playGen.current;
    const el = videoRef.current;
    if (!el) return;

    const play = () => {
      if (playGen.current !== gen) return;
      const attempt = el.play();
      if (attempt) {
        attempt
          .then(() => {
            if (playGen.current === gen) setLive(true);
          })
          .catch(() => {
            if (playGen.current === gen) setLive(false);
          });
      }
    };

    const rewindAndPlay = () => {
      if (playGen.current !== gen) return;
      try {
        el.currentTime = 0;
      } catch {
        /* metadata not ready */
      }
      play();
    };

    if (el.readyState >= 1) {
      rewindAndPlay();
      return;
    }

    el.addEventListener('loadeddata', rewindAndPlay, { once: true });
    el.load();
  }, [canPlay]);

  useEffect(() => () => {
    playGen.current += 1;
    videoRef.current?.pause();
  }, []);

  if (!image) return null;

  const mediaStyle = { objectPosition };
  const label = imageAlt || 'Project preview';

  return (
    <figure
      className={`project-preview focus-ring ${live ? 'is-live' : ''} ${className}`.trim()}
      tabIndex={canPlay ? 0 : undefined}
      role={canPlay ? 'button' : undefined}
      aria-label={canPlay ? `${label}. Hover or focus to play the demo.` : undefined}
      aria-pressed={canPlay ? live : undefined}
      onPointerEnter={() => {
        if (finePointer) start();
      }}
      onPointerLeave={() => {
        if (finePointer) stop();
      }}
      onFocus={(event) => {
        if (finePointer || event.currentTarget.matches(':focus-visible')) start();
      }}
      onBlur={() => stop()}
      onClick={() => {
        if (!canPlay || finePointer) return;
        if (live) stop();
        else start();
      }}
      onKeyDown={(event) => {
        if (!canPlay) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
      }}
    >
      <img src={image} alt={canPlay ? '' : imageAlt} draggable="false" style={mediaStyle} />
      {canPlay ? (
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          style={mediaStyle}
        />
      ) : null}
      <div className="project-preview-hud" aria-hidden="true">
        <span className="preview-vignette" />
        <span className="preview-scan" />
        <span className="preview-sweep" />
        <span className="preview-corners" />
        {canPlay ? <span className="preview-chip">{live ? 'Live' : 'Scan'}</span> : null}
      </div>
    </figure>
  );
}
