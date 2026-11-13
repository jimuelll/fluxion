'use client';

import { useEffect } from 'react';

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const TILE = 1000; // height of one squiggle tile in ui.tsx's LOOP path

/**
 * All of Kaye's scroll behaviour in one place. CSS does the animating; this flips classes and sets a few values.
 * - reveals + count-ups: one-shot, stay revealed on the way back up
 * - squiggles + services spine: drawn tip follows the viewport, both directions
 * - process: pinned and fully scrubbed, so it rewinds when scrolling up
 */
export function Motion() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const countUp = (el: HTMLElement) => {
      const to = Number(el.dataset.count);
      const dec = Number(el.dataset.decimals ?? 0);
      const suffix = el.dataset.suffix ?? '';
      if (reduced) return;
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1500);
        el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec) + suffix;
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
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

    // Squiggles: each one is tiled to run the full height of its section, and its drawn tip follows the
    // viewport (about three-quarters down the screen), retracting again when scrolling back up.
    const squiggles = [...document.querySelectorAll<SVGSVGElement>('[data-squiggle]')].map((svg) => ({
      svg,
      path: svg.querySelector('path')!,
      host: svg.parentElement!,
      tile: svg.querySelector('path')!.getAttribute('d')!,
    }));
    const buildSquiggles = () => {
      for (const s of squiggles) {
        const top = s.svg.getBoundingClientRect().top - s.host.getBoundingClientRect().top; // SVG has no offsetTop
        const tiles = Math.max(1, Math.ceil((s.host.offsetHeight - top) / TILE));
        // Shift every y in the tile path down by k tiles and drop the repeated "M" so it stays one stroke.
        const shift = (k: number) =>
          s.tile.replace(/(-?[\d.]+)[ ,]+(-?[\d.]+)/g, (_, x, y) => `${x} ${+y + k * TILE}`);
        const d = Array.from({ length: tiles }, (_, k) => (k ? shift(k).replace(/^M[^C]*/, '') : s.tile)).join(' ');
        s.path.setAttribute('d', d);
        s.svg.setAttribute('viewBox', `0 0 324 ${tiles * TILE}`);
        s.svg.style.height = `${tiles * TILE}px`;
      }
    };

    // About paragraph: words light up as it travels up the screen.
    const fill = document.querySelector<HTMLElement>('[data-fill]');
    const words = fill ? [...fill.querySelectorAll<HTMLElement>('.w')] : [];

    // Services: a smooth path through each item's anchor, rebuilt on resize.
    const svc = document.querySelector<HTMLElement>('[data-svc]');
    const svcSvg = svc?.querySelector('svg');
    const track = svc?.querySelector<SVGPathElement>('.svc__track');
    const fillPath = svc?.querySelector<SVGPathElement>('.svc__fill');
    const dot = svc?.querySelector<SVGCircleElement>('.svc__dot');
    const anchors = svc ? [...svc.querySelectorAll<HTMLElement>('.svc__anchor')] : [];
    let svcLen = 0;
    let svcYs: number[] = []; // anchor centres, in .svc coordinates
    const buildSvc = () => {
      if (!svc || !svcSvg || !track || !fillPath) return;
      const box = svc.getBoundingClientRect();
      svcSvg.setAttribute('width', `${box.width}`);
      svcSvg.setAttribute('height', `${box.height}`);
      const pts = anchors.map((a) => {
        const r = a.getBoundingClientRect();
        return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
      });
      // The anchors share one x (the spine); a small alternating sway keeps it hand-drawn without leaving the gutter.
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        const sway = box.width < 700 ? 0 : i % 2 ? 26 : -26; // mobile spine hugs the edge: keep it straight
        d += ` C${x0 + sway} ${y0 + (y1 - y0) * 0.35}, ${x1 + sway} ${y1 - (y1 - y0) * 0.35}, ${x1} ${y1}`;
      }
      track.setAttribute('d', d);
      fillPath.setAttribute('d', d);
      svcYs = pts.map((p) => p[1]);
      svcLen = fillPath.getTotalLength();
      fillPath.style.strokeDasharray = `${svcLen}`;
    };

    // Process: pinned section, active step from scroll progress.
    const proc = document.querySelector<HTMLElement>('[data-process]');
    const steps = proc ? [...proc.querySelectorAll<HTMLElement>('.step')] : [];
    const nodes = proc ? [...proc.querySelectorAll<HTMLElement>('.process__node')] : [];
    const stepN = proc?.querySelector<HTMLElement>('[data-step-n]');

    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = innerHeight;

      for (const s of squiggles) {
        const r = s.svg.getBoundingClientRect();
        const visible = Math.min(r.height, s.host.getBoundingClientRect().bottom - r.top);
        const p = reduced ? 1 : clamp((vh * 0.75 - r.top) / visible) * (visible / r.height);
        s.path.style.strokeDashoffset = `${1 - p}`;
      }

      if (fill) {
        const r = fill.getBoundingClientRect();
        const p = reduced ? 1 : clamp((vh * 0.8 - r.top) / (vh * 0.6));
        const lit = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle('lit', i < lit));
      }

      if (svc && dot && fillPath && svcLen) {
        // The dot rides at 60% of the viewport height between the first and last anchor, both ways.
        const r = svc.getBoundingClientRect();
        const first = svcYs[0];
        const last = svcYs[svcYs.length - 1];
        const p = reduced ? 1 : clamp((vh * 0.6 - r.top - first) / (last - first));
        fillPath.style.strokeDashoffset = `${svcLen * (1 - p)}`;
        const pt = fillPath.getPointAtLength(svcLen * p);
        dot.setAttribute('cx', `${pt.x}`);
        dot.setAttribute('cy', `${pt.y}`);
        anchors.forEach((a, i) => a.classList.toggle('on', svcYs[i] <= pt.y + 1));
      }

      if (proc) {
        const r = proc.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - vh));
        const active = Math.min(steps.length - 1, Math.floor(p * steps.length));
        proc.style.setProperty('--p', `${p}`);
        steps.forEach((s, i) => {
          s.classList.toggle('is-active', i === active);
          s.classList.toggle('is-done', i < active);
        });
        nodes.forEach((n, i) => n.classList.toggle('on', i <= active));
        if (stepN) stepN.textContent = `0${active + 1}`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      buildSvc();
      buildSquiggles();
      onScroll();
    };

    document.fonts.ready.then(onResize);
    buildSvc();
    buildSquiggles();
    frame();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    // Rebuild the spine whenever the list itself changes size (fonts, images, breakpoints).
    const ro = new ResizeObserver(onResize);
    if (svc) ro.observe(svc);
    return () => {
      ro.disconnect();
      io.disconnect();
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
