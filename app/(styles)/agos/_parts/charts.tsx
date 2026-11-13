'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { Marker } from './data';

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Tween an array of numbers to a new target. Interrupting mid-way continues from wherever the values are,
 * so rapid range changes never snap. `target` must be referentially stable (memoise it).
 */
export function useTween(target: number[], ms = 700) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (reduced()) {
      from.current = target;
      setValue(target);
      return;
    }
    const a = from.current.length === target.length ? from.current : target.map(() => 0);
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = easeInOut(Math.min(1, (t - t0) / ms));
      const cur = target.map((y, i) => a[i] + (y - a[i]) * k);
      from.current = cur;
      setValue(cur);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

/** Width of an element, tracked. Charts draw in real pixels so strokes stay crisp and even. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** A number that rolls to its new value. */
export function Roll({ value, format }: { value: number; format: (v: number) => string }) {
  const target = useRef<number[]>([value]);
  if (target.current[0] !== value) target.current = [value];
  const [v] = useTween(target.current, 800);
  return <span className="roll">{format(v)}</span>;
}

/** Bar sparkline: older bars dark, the latest five light, `hot` bars in the alert colour. */
export function Bars({ values, hot = [] }: { values: number[]; hot?: number[] }) {
  const n = values.length;
  return (
    <span className="bars" aria-hidden>
      {values.map((v, i) => (
        <i key={i} className={hot.includes(i) ? 'is-hot' : i >= n - 5 ? 'is-light' : ''} style={{ '--h': Math.min(1, v), '--i': i } as React.CSSProperties} />
      ))}
    </span>
  );
}

const line = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');

/** Tiny line sparkline (tables). */
export function Spark({ values, hot = false }: { values: number[]; hot?: boolean }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const d = line(values.map((v, i) => [(i / (values.length - 1)) * 100, 28 - ((v - min) / (max - min || 1)) * 24]));
  return (
    <svg className={`spark ${hot ? 'is-hot' : ''}`} viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
      <path d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Sparkline with a soft area fill (map detail card). */
export function AreaSpark({ values, hot = false }: { values: number[]; hot?: boolean }) {
  const id = useId();
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 240, 52 - ((v - min) / (max - min || 1)) * 40] as [number, number]);
  return (
    <svg className={`aspark ${hot ? 'is-hot' : ''}`} viewBox="0 0 240 56" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line(pts)} L240 56 L0 56 Z`} fill={`url(#${id})`} />
      <path d={line(pts)} className="aspark__line" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function niceStep(x: number) {
  const p = 10 ** Math.floor(Math.log10(x));
  const f = x / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}

type LineProps = {
  mid: number[];
  low: number[];
  high: number[];
  ticks: { i: number; label: string }[];
  band?: [number, number] | null;
  bandLabel?: string;
  markers?: Marker[];
  unit: string;
  names: [string, string, string]; // mid, low, high
  height?: number;
};

/**
 * Three-line chart: a glowing headline line, a quiet line below, a dotted line above. The anomaly band turns the
 * headline red inside it. Draws in on mount, morphs between datasets, crosshair readout on hover.
 */
export function LineChart({ mid, low, high, ticks, band, bandLabel, markers = [], unit, names, height = 230 }: LineProps) {
  const clip = useId().replace(/:/g, '');
  const [ref, w] = useWidth<HTMLDivElement>();
  const tm = useTween(mid);
  const tl = useTween(low);
  const th = useTween(high);
  const [hover, setHover] = useState<number | null>(null);
  const n = mid.length;
  const H = height;
  const step = niceStep((Math.max(...high) * 1.08) / 3);
  const top = step * Math.ceil((Math.max(...high) * 1.08) / step);
  const x = (i: number) => (i / (n - 1)) * w;
  const y = (v: number) => H - (v / top) * H;
  const pts = (vs: number[]) => vs.map((v, i) => [x(i), y(v)] as [number, number]);
  const grid = Array.from({ length: Math.round(top / step) + 1 }, (_, k) => k * step);
  const pct = (i: number) => `${(i / (n - 1)) * 100}%`;
  const fmt = (v: number) => (Number.isInteger(v) ? v : v.toFixed(1));

  return (
    <div className="line">
      <div
        className="line__plot"
        ref={ref}
        style={{ height: H }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setHover(Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left) / r.width) * (n - 1)))));
        }}
        onPointerLeave={() => setHover(null)}
      >
        {band && (
          <div className="line__band" style={{ left: pct(band[0]), width: `${((band[1] - band[0]) / (n - 1)) * 100}%` }}>
            {bandLabel && <span>{bandLabel}</span>}
          </div>
        )}
        {w > 0 && (
          <svg width={w} height={H} aria-hidden>
            <defs>
              <clipPath id={clip}>{band && <rect x={x(band[0])} width={x(band[1]) - x(band[0])} y={-20} height={H + 40} />}</clipPath>
            </defs>
            {grid.map((g) => (
              <line key={g} className="line__grid" x1={0} x2={w} y1={y(g)} y2={y(g)} />
            ))}
            <path className="line__high" d={line(pts(th))} />
            <path className="line__low" d={line(pts(tl))} pathLength={1} />
            <path className="line__mid" d={line(pts(tm))} pathLength={1} />
            {band && <path className="line__mid line__mid--hot" d={line(pts(tm))} clipPath={`url(#${clip})`} pathLength={1} />}
          </svg>
        )}
        {markers.map((m) => (
          <span key={m.label} className={`lolly ${m.hot ? 'is-hot' : ''}`} style={{ left: pct(m.i) }}>
            <em>{m.label}</em>
          </span>
        ))}
        {hover !== null && (
          <>
            <span className="line__cross" style={{ left: pct(hover) }} />
            <span className="line__dot" style={{ left: pct(hover), bottom: `${(tm[hover] / top) * 100}%` }} />
            <div className={`line__tip ${hover > n * 0.68 ? 'is-left' : ''}`} style={{ left: pct(hover) }}>
              {(
                [
                  [names[0], tm, 'mid'],
                  [names[1], tl, 'low'],
                  [names[2], th, 'high'],
                ] as const
              ).map(([name, vs, k]) => (
                <span key={k}>
                  <i className={`key key--${k}`} /> {name}
                  <b>
                    {vs[hover].toFixed(0)} <small>{unit}</small>
                  </b>
                </span>
              ))}
            </div>
          </>
        )}
        <div className="line__y" aria-hidden>
          {grid.map((g) => (
            <span key={g} style={{ bottom: `${(g / top) * 100}%` }}>
              {fmt(g)}
            </span>
          ))}
        </div>
      </div>
      <div className="line__x" aria-hidden>
        {ticks.map((t) => (
          <span key={t.label} style={{ left: pct(t.i) }}>
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
