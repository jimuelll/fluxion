'use client';

import { useState } from 'react';
import { Eye, Heart, Play } from 'lucide-react';
import { CARDS, FILTERS, type Filter } from './content';
import { Photo } from './ui';

/** Filter chips with live counts over a grid of phone-style video cards. */
export function Portfolio() {
  const [filter, setFilter] = useState<Filter>('All');
  const count = (f: Filter) => (f === 'All' ? CARDS.length : CARDS.filter((c) => c.tag === f).length);
  const shown = CARDS.filter((c) => filter === 'All' || c.tag === filter);

  return (
    <>
      <div className="chips" role="group" aria-label="Filter videos">
        {FILTERS.map((f) => (
          <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f}
            <sup>{count(f)}</sup>
          </button>
        ))}
      </div>
      <div className="reels">
        {shown.map((c, i) => (
          // key includes the filter so cards replay their entrance when the set changes
          <article key={`${filter}-${c.brand}`} className="reel" style={{ '--i': i } as React.CSSProperties}>
            <Photo name={c.photo} />
            <div className="reel__top">
              <span className="reel__handle">
                <span className="reel__avatar" aria-hidden />
                @kaye.eats
              </span>
              <Heart size={16} strokeWidth={2} aria-hidden />
            </div>
            <p className="reel__caption">{c.caption}</p>
            <span className="reel__play" aria-hidden>
              <Play size={18} fill="currentColor" />
            </span>
            <div className="reel__foot">
              <span className="reel__tag">{c.tag}</span>
              <strong>{c.brand}</strong>
              <span className="reel__meta">
                {c.product}
                <span>
                  <Eye size={12} aria-hidden /> {c.views}
                </span>
              </span>
            </div>
            <span className="reel__progress" aria-hidden />
          </article>
        ))}
      </div>
    </>
  );
}
