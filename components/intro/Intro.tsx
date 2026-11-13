'use client';

import { useEffect, useRef, useState } from 'react';
import { VerseText } from './VerseText';
import s from './intro.module.css';

const TEXT =
  'Fluxion is a wall of screens, each tuned to a different handmade UI. Its own type, color, layout and motion. Pick a channel.';

export default function Intro() {
  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  const enter = () => {
    setLeaving(true);
    setTimeout(() => setOpen(false), 600);
  };

  useEffect(() => {
    // Styles are separate documents, so "back to the wall" is a fresh load: only a reload or a first visit in this tab plays it.
    const reload = performance.getEntriesByType('navigation')[0]?.toJSON().type === 'reload';
    try {
      if (!reload && sessionStorage.getItem('fluxion-intro')) return setOpen(false);
      sessionStorage.setItem('fluxion-intro', '1');
    } catch {}
    btn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && enter();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;
  return (
    <div className={s.intro} data-leaving={leaving} role="dialog" aria-label="About Fluxion">
      <VerseText text={TEXT} tone="dark" idle={false}className={s.text} />
      <button ref={btn} className={s.enter} onClick={enter}>
        Enter
      </button>
    </div>
  );
}
