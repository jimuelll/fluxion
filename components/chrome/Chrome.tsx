'use client';

import { useState } from 'react';
import s from './chrome.module.css';

/** Drop into every style's root layout: CRT power-on on load, and the remote that powers off back to the wall. */
export function Chrome({ slug }: { slug: string }) {
  const [off, setOff] = useState(false);
  const back = `/?from=${slug}`;

  return (
    <>
      {/* Every style "powers on" fresh, so a refresh starts at the top instead of the browser's restored scroll.
          Inline so it runs while the HTML parses, before the browser restores scroll on load. */}
      <script
        dangerouslySetInnerHTML={{ __html: "history.scrollRestoration='manual';scrollTo({top:0,behavior:'instant'})" }}
      />
      <div className={`${s.screen} ${off ? s.off : ''}`} aria-hidden onAnimationEnd={() => off && location.assign(back)}>
        <div className={s.window} />
      </div>
      <a
        href={back}
        className={s.remote}
        onClick={(e) => {
          e.preventDefault();
          setOff(true);
        }}
      >
        <span className={s.power} />
        <span className={s.key} />
        <span className={s.key} />
        <span className={s.label}>Back to the TV wall</span>
      </a>
    </>
  );
}
