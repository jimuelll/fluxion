'use client';

import { useEffect } from 'react';

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Tropa's scroll engine, modelled on Skydive's pinned scenes. JS only measures; CSS does every visual.
 * - [data-scene]: tall section with a sticky stage. Sets --p (0→1) and the active step, then flags
 *   children with [data-at="n"] or [data-at="a-b"]: .is-on once reached, .is-now while inside the range.
 * - [data-fill]: free-flowing text; sets --q (0→1) as it rises through the viewport, words light from it.
 * - [data-reveal]: one-shot entrance.
 */
export function Motion() {
  useEffect(() => {
    const scenes = [...document.querySelectorAll<HTMLElement>('[data-scene]')].map((el) => ({
      el,
      steps: Number(el.dataset.steps ?? 1),
      marks: [...el.querySelectorAll<HTMLElement>('[data-at]')].map((m) => {
        const [a, b = a] = m.dataset.at!.split('-').map(Number);
        return { m, a, b };
      }),
      last: -1,
    }));
    const fills = [...document.querySelectorAll<HTMLElement>('[data-fill]')];

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

    const top = document.querySelector<HTMLElement>('.nav');
    const menu = document.getElementById('tr-menu');
    const cta = document.querySelector<HTMLElement>('.cta');

    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = innerHeight;
      top?.classList.toggle('is-scrolled', scrollY > 8);
      top?.classList.toggle('is-away', !!cta && cta.getBoundingClientRect().top < 90 && !menu?.matches(':popover-open'));

      for (const s of scenes) {
        const r = s.el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue; // off-screen scenes keep their last state
        const p = clamp(-r.top / (r.height - vh));
        s.el.style.setProperty('--p', p.toFixed(4));
        const step = Math.min(s.steps - 1, Math.floor(p * s.steps));
        if (step === s.last) continue;
        s.last = step;
        s.el.dataset.step = String(step);
        for (const { m, a, b } of s.marks) {
          m.classList.toggle('is-on', step >= a);
          m.classList.toggle('is-now', step >= a && step <= b);
        }
      }

      for (const f of fills) {
        const r = f.getBoundingClientRect();
        f.style.setProperty('--q', clamp((vh * 0.85 - r.top) / (vh * 0.55 + r.height * 0.5)).toFixed(3));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    frame();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    // In-page anchors don't light-dismiss a popover, so close it on link tap.
    const closeMenu = (e: Event) => (e.target as Element).closest('a') && menu?.hidePopover();
    menu?.addEventListener('click', closeMenu);
    return () => {
      io.disconnect();
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      menu?.removeEventListener('click', closeMenu);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
