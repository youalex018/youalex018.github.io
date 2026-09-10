import { useState } from 'react';

export function Timeline({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <ol className="relative m-0 list-none border-l border-current/20 p-0 pl-6">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <li key={item.id} className="relative mb-4 last:mb-0">
            <span
              className={`absolute top-5 -left-[1.7rem] h-2.5 w-2.5 rounded-full border border-current ${
                open ? 'bg-current shadow-[0_0_12px_currentColor]' : 'bg-transparent'
              }`}
            />
            <button
              type="button"
              className="focus-ring starlight-glow glass w-full rounded-2xl p-5 text-left transition sm:p-6"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <p className="m-0 font-mono text-[0.65rem] uppercase tracking-[0.2em]" style={{ color: 'var(--ink-muted)' }}>
                {item.date}
              </p>
              <h3 className="display mt-2 mb-0 text-2xl leading-tight font-medium" style={{ color: 'var(--ink)' }}>
                {item.role}
              </h3>
              <p className="mt-1 mb-0" style={{ color: 'var(--ink-muted)' }}>
                {item.org}
              </p>
              {open ? (
                <ul className="mt-4 mb-0 list-disc space-y-2 pl-4 text-[0.98rem] leading-relaxed" style={{ color: 'var(--ink)' }}>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 mb-0 font-mono text-[0.65rem] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-muted)' }}>
                  Expand
                </p>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
