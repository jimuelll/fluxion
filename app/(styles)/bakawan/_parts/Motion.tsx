'use client';

import { useEffect } from 'react';

const WORD_STAGGER = 70; // ms; keep in sync with .word transition-delay in style.css

/** All of Bakawan's scroll motion: reveals, word fill and count-ups. CSS does the animating; this only flips classes and numbers. */
export function Motion() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const countUp = (el: HTMLElement) => {
      const to = Number(el.dataset.count);
      const suffix = el.dataset.suffix ?? '';
      if (reduced) return;
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1600);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US') + suffix;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add('in');
          el.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
          io.unobserve(el);
          // Word reveals run under the goo filter, which comes off once the last word has settled.
          const words = el.querySelectorAll('.word').length;
          if (words && !reduced) {
            el.classList.add('goo');
            setTimeout(() => el.classList.replace('goo', 'settled'), words * WORD_STAGGER + 1300);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

    // Word fill: words light up as the paragraph travels up the viewport.
    const fills = [...document.querySelectorAll<HTMLElement>('[data-fill]')].map((el) => ({ el, words: [...el.querySelectorAll('.word')] }));
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const { el, words } of fills) {
          const r = el.getBoundingClientRect();
          const p = reduced ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.55)));
          const lit = Math.round(p * words.length);
          words.forEach((w, i) => w.classList.toggle('lit', i < lit));
        }
      });
    };
    // Header: tucks away while scrolling down, returns on any scroll up.
    const nav = document.querySelector<HTMLElement>('.nav');
    const menu = document.getElementById('tw-menu');
    let lastY = scrollY;
    const onNav = () => {
      const y = scrollY;
      nav?.classList.toggle('is-scrolled', y > 8);
      if (Math.abs(y - lastY) < 6) return;
      nav?.classList.toggle('is-hidden', y > lastY && y > 160 && !menu?.matches(':popover-open'));
      lastY = y;
    };

    // Blob pile: tiles near the pointer lean away, then spring back (the overshoot is in the CSS transition).
    const pile = document.querySelector<HTMLElement>('.pile');
    const tiles = [...document.querySelectorAll<HTMLElement>('.blob')].map((el) => ({ el, body: el.querySelector<HTMLElement>('.blob__body')! }));
    const onPile = (e: PointerEvent) => {
      for (const { el, body } of tiles) {
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - e.clientX;
        const dy = r.top + r.height / 2 - e.clientY;
        const d = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - d / 260);
        const ux = Math.abs(dx) < 1 ? 1 : dx / d;
        body.style.transform = `translate(${(ux * f * 30).toFixed(2)}px, ${((dy / d) * f * 10).toFixed(2)}px) rotate(${(ux * f * 7).toFixed(2)}deg)`;
      }
    };
    const offPile = () => tiles.forEach(({ body }) => (body.style.transform = ''));
    const canHover = matchMedia('(hover: hover)').matches && !reduced;
    if (pile && canHover) {
      pile.addEventListener('pointermove', onPile);
      pile.addEventListener('pointerleave', offPile);
    }

    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('scroll', onNav, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener('scroll', onScroll);
      removeEventListener('scroll', onNav);
      pile?.removeEventListener('pointermove', onPile);
      pile?.removeEventListener('pointerleave', offPile);
    };
  }, []);

  return null;
}
