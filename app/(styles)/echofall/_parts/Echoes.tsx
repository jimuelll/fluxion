'use client';
import { useEffect } from 'react';

// Pressing a button or board plate leaves an echo: an offset outline that slides off and fades.
export default function Echoes() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onDown = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest('.btn, .plate, .nav a.cta');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const echo = document.createElement('span');
      echo.className = 'press-echo';
      echo.setAttribute('aria-hidden', 'true');
      // follow the element's clipped corner: plates cut top-right, the primary button bottom-right
      const cut = getComputedStyle(el).getPropertyValue('--cut').trim() || '26px';
      const clip = el.matches('.plate') ? `polygon(0 0, calc(100% - ${cut}) 0, 100% ${cut}, 100% 100%, 0 100%)` : getComputedStyle(el).clipPath;
      Object.assign(echo.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, clipPath: clip === 'none' ? '' : clip });
      document.body.appendChild(echo);
      echo.addEventListener('animationend', () => echo.remove(), { once: true });
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);
  return null;
}
