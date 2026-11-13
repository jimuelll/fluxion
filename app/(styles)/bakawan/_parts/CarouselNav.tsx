'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

/** Prev/next buttons for a native scroll-snap rail. */
export function CarouselNav({ target }: { target: string }) {
  const go = (dir: 1 | -1) => {
    const rail = document.getElementById(target);
    const card = rail?.firstElementChild as HTMLElement | null;
    if (rail && card) rail.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: 'smooth' });
  };
  return (
    <div className="arrows">
      <button onClick={() => go(-1)} aria-label="Previous" aria-controls={target}>
        <ArrowLeft size={16} strokeWidth={1.6} />
      </button>
      <button onClick={() => go(1)} aria-label="Next" aria-controls={target}>
        <ArrowRight size={16} strokeWidth={1.6} />
      </button>
    </div>
  );
}
