'use client';

import { useMemo, useState } from 'react';
import { HUBS, ISLANDS, ROUTES, effectiveHub, hubSeries, inRegion, type Hub, type Island, type Region } from './data';
import { AreaSpark } from './charts';

// Equirectangular projection of the archipelago into a 400 x 668 box (40 units per degree).
const LON0 = 116.8;
const LAT0 = 19.2;
const K = 40;
const W = 400;
const H = 588;
const px = (lon: number) => (lon - LON0) * K;
const py = (lat: number) => (LAT0 - lat) * K;

const GROUP: Island[] = ['Luzon', 'Luzon', 'Luzon', 'Visayas', 'Visayas', 'Visayas', 'Visayas', 'Visayas', 'Visayas', 'Visayas', 'Mindanao'];

/** Which hubs get a label pill, and on which side (kept apart so pills never collide). */
const LABELS: Record<string, 'l' | 'r'> = { LAO: 'l', BAG: 'l', MNL: 'r', NAG: 'r', PPS: 'l', ILO: 'l', CEB: 'r', TAC: 'r', CGY: 'r', ZAM: 'l', DVO: 'r' };

function inside([x, y]: [number, number], ring: [number, number][]) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

// The dot grid is computed once: every 0.14° step that falls on land.
const DOTS = (() => {
  const out: { x: number; y: number; g: Island }[] = [];
  for (let lat = LAT0; lat > 4.5; lat -= 0.14) {
    for (let lon = LON0; lon < 126.8; lon += 0.14) {
      const ring = ISLANDS.findIndex((r) => inside([lon, lat], r));
      if (ring >= 0) out.push({ x: px(lon), y: py(lat), g: GROUP[ring] });
    }
  }
  return out;
})();

const byCode = (c: string) => HUBS.find((h) => h.code === c)!;
const kfmt = (n: number) => `${(n / 1000).toFixed(n < 10000 ? 1 : 0)}k`;

function arc(a: Hub, b: Hub) {
  const [x1, y1, x2, y2] = [px(a.lon), py(a.lat), px(b.lon), py(b.lat)];
  const len = Math.hypot(x2 - x1, y2 - y1);
  // bow each route sideways by a sixth of its length
  return `M${x1} ${y1} Q${(x1 + x2) / 2 + ((y2 - y1) / len) * len * 0.16} ${(y1 + y2) / 2 - ((x2 - x1) / len) * len * 0.16} ${x2} ${y2}`;
}

export function PhMap({ region, rerouted }: { region: Region; rerouted: boolean }) {
  const hubs = useMemo(() => HUBS.map((h) => effectiveHub(h, rerouted)), [rerouted]);
  const worst = useMemo(() => [...hubs].filter((h) => inRegion(h, region)).sort((a, b) => b.dwell - a.dwell)[0], [hubs, region]);
  const [hoverCode, setHoverCode] = useState<string | null>(null);
  const focus = hubs.find((h) => h.code === hoverCode) ?? worst;
  const hot = (h: Hub) => h.status === 'Elevated' || (h.status === 'Watch' && h.dwell > 50);

  // Dots near hubs glow; dots near a delayed hub glow red. Off-region dots fade back.
  const dots = useMemo(() => {
    const live = hubs.filter((h) => inRegion(h, region));
    return DOTS.map((d) => {
      if (region !== 'All islands' && d.g !== region) return { ...d, fill: 'rgb(255 255 255 / 0.05)' };
      let glow = 0;
      let red = 0;
      for (const h of live) {
        const q = Math.exp(-((d.x - px(h.lon)) ** 2 + (d.y - py(h.lat)) ** 2) / (2 * 15 * 15));
        if (hot(h)) red += q * (h.status === 'Elevated' ? 1 : 0.6);
        else glow += q * Math.min(1, 0.35 + h.parcels / 30000);
      }
      if (red > 0.18) return { ...d, fill: `rgb(255 95 79 / ${(0.25 + Math.min(red, 1) * 0.6).toFixed(2)})` };
      return { ...d, fill: `rgb(255 255 255 / ${(0.17 + Math.min(glow, 1) * 0.5).toFixed(2)})` };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubs, region]);

  const series = useMemo(() => hubSeries(focus.code, focus.dwell, 40), [focus]);

  return (
    <div className="map">
      <div className="map__geo">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of hubs across the Philippines">
          <defs>
            <radialGradient id="ag-halo">
              <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ag-halo-hot">
              <stop offset="0" stopColor="#ff5f4f" stopOpacity="0.7" />
              <stop offset="1" stopColor="#ff5f4f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g>
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={1.7} fill={d.fill} />
            ))}
          </g>
          <g className="map__routes">
            {ROUTES.map(([from, to], i) => {
              const a = byCode(from);
              const b = byCode(to);
              const d = arc(a, b);
              const on = inRegion(a, region) || inRegion(b, region);
              const isHot = !rerouted && (from === 'CEB' || to === 'CEB');
              return (
                <g key={i} className={`${on ? '' : 'is-off'} ${isHot ? 'is-hot' : ''}`}>
                  <path d={d} />
                  {on && (
                    <circle r={2} className="map__parcel">
                      <animateMotion dur={`${(isHot ? 10 : 6) + (i % 4)}s`} begin={`${-i * 1.1}s`} repeatCount="indefinite" path={d} />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>
          <g>
            {hubs.map((h) => (
              <g
                key={h.code}
                transform={`translate(${px(h.lon)} ${py(h.lat)})`}
                className={`hub ${hot(h) ? 'is-hot' : ''} ${inRegion(h, region) ? '' : 'is-off'} ${focus.code === h.code ? 'is-focus' : ''}`}
                onPointerEnter={() => setHoverCode(h.code)}
                onPointerLeave={() => setHoverCode(null)}
              >
                <circle className="hub__halo" r={16} fill={hot(h) ? 'url(#ag-halo-hot)' : 'url(#ag-halo)'} />
                {hot(h) && <circle className="hub__ring" r={7} />}
                <circle className="hub__core" r={4.2} />
                <circle r={14} fill="transparent" />
              </g>
            ))}
          </g>
        </svg>
        {hubs
          .filter((h) => LABELS[h.code])
          .map((h) => (
            <button
              key={h.code}
              className={`pill pill--${LABELS[h.code]} ${hot(h) ? 'is-hot' : ''} ${inRegion(h, region) ? '' : 'is-off'}`}
              style={{ left: `${(px(h.lon) / W) * 100}%`, top: `${(py(h.lat) / H) * 100}%` }}
              onPointerEnter={() => setHoverCode(h.code)}
              onPointerLeave={() => setHoverCode(null)}
              onFocus={() => setHoverCode(h.code)}
              onBlur={() => setHoverCode(null)}
              aria-label={`${h.name}: ${h.dwell} minute dwell`}
            >
              <code>{h.code.toLowerCase()}</code> <span>{kfmt(h.parcels)}</span>
            </button>
          ))}
      </div>

      <div className={`map__card ${hot(focus) ? 'is-hot' : ''}`} style={{ '--y': py(focus.lat) / H } as React.CSSProperties} aria-live="polite">
        <header>
          <span className={`dot ${hot(focus) ? 'dot--hot' : 'dot--ok'}`} />
          <strong>{focus.name}</strong>
          <code>{focus.code.toLowerCase()} · p50</code>
        </header>
        <AreaSpark values={series} hot={hot(focus)} />
        <dl>
          <div>
            <dt>Dwell</dt>
            <dd className={hot(focus) ? 'hot' : ''}>
              {focus.dwell}
              <small>min</small>
            </dd>
          </div>
          <div>
            <dt>Parcels</dt>
            <dd>{kfmt(focus.parcels)}</dd>
          </div>
          <div>
            <dt>On time</dt>
            <dd className={focus.onTime < 90 ? 'hot' : ''}>
              {focus.onTime}
              <small>%</small>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
