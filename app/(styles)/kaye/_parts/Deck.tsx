'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QUOTES } from './content';

/** Testimonials as a stacked deck: the front card leaves, the next one slides up. */
export function Deck() {
  const [at, setAt] = useState(0);
  const n = QUOTES.length;
  const go = (d: number) => setAt((a) => (a + d + n) % n);

  return (
    <div className="deck">
      <div className="deck__stack" aria-live="polite">
        {QUOTES.map((q, i) => {
          const depth = (i - at + n) % n; // 0 = front
          return (
            <figure key={q.name} className="deck__card" data-depth={Math.min(depth, 3)} aria-hidden={depth !== 0}>
              <blockquote>&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption>
                <span className="deck__avatar" aria-hidden>
                  {q.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')}
                </span>
                <span>
                  <strong>{q.name}</strong>
                  <small>{q.role}</small>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <div className="deck__nav">
        <button onClick={() => go(-1)} aria-label="Previous testimonial">
          <ArrowLeft size={16} strokeWidth={2.4} />
        </button>
        <span className="deck__dots" aria-hidden>
          {QUOTES.map((q, i) => (
            <span key={q.name} data-on={i === at} />
          ))}
        </span>
        <button onClick={() => go(1)} aria-label="Next testimonial">
          <ArrowRight size={16} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
