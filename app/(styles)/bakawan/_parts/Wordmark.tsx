'use client';

import { useEffect, useRef } from 'react';

type Blob = { x: number; y: number; r: number; max: number; born: number };

const GROW = 450; // ms to reach full size
const HOLD = 1400; // ms before it starts receding
const FADE = 1200; // ms to shrink away

/**
 * Giant footer wordmark on a canvas: the pointer leaves coral that spreads inside the letters, then recedes.
 * The moss is drawn with `source-atop`, so it only ever paints where the text already is.
 */
export function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(c);
    const ink = css.color;
    const moss = css.getPropertyValue('--accent').trim() || '#a7eb7a';
    const blobs: Blob[] = [];
    let w = 0;
    let h = 0;
    let size = 0;
    let raf = 0;
    let last = { x: -1e9, y: -1e9 };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = ink;
      ctx.fillText(text, 0, h);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = moss;
      const now = performance.now();
      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i];
        const age = now - b.born;
        const grow = Math.min(1, Math.max(0, age / GROW)); // droplets can be born slightly in the future
        const fade = age > HOLD ? Math.max(0, 1 - (age - HOLD) / FADE) : 1;
        b.r = b.max * (1 - Math.pow(1 - grow, 3)) * fade;
        if (age > HOLD + FADE) {
          blobs.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = blobs.length ? requestAnimationFrame(draw) : 0;
    };

    const fit = () => {
      const family = css.fontFamily;
      ctx.font = `600 100px ${family}`;
      ctx.letterSpacing = '-5px'; // -0.05em at 100px
      const at100 = ctx.measureText(text).width;
      w = c.parentElement!.clientWidth;
      size = (100 * w) / at100;
      h = Math.ceil(size * 0.78); // ascender height of a word with no descenders
      const dpr = Math.min(2, devicePixelRatio);
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `600 ${size}px ${family}`;
      ctx.letterSpacing = `${-0.05 * size}px`;
      ctx.textBaseline = 'alphabetic';
      draw();
    };

    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (Math.hypot(x - last.x, y - last.y) < size * 0.05) return;
      last = { x, y };
      const now = performance.now();
      blobs.push({ x, y, r: 0, max: size * (0.14 + Math.random() * 0.12), born: now });
      // Satellite droplets so the edge looks organic rather than a trail of circles.
      for (let i = 0; i < 3; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = size * (0.18 + Math.random() * 0.2);
        blobs.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, r: 0, max: size * (0.01 + Math.random() * 0.03), born: now + Math.random() * 200 });
      }
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(fit);
    document.fonts.ready.then(() => {
      fit();
      ro.observe(c.parentElement!);
    });
    if (!reduced) c.addEventListener('pointermove', onMove);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      c.removeEventListener('pointermove', onMove);
    };
  }, [text]);

  return (
    <div className="wordmark">
      <canvas ref={ref} aria-hidden />
    </div>
  );
}
