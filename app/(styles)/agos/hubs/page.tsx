'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Search, X } from 'lucide-react';
import { HUBS, dwellSeries, effectiveHub, hubSeries, inRegion, type Hub, type HubStatus } from '../_parts/data';
import { LineChart, Spark } from '../_parts/charts';
import { useAgos } from '../_parts/store';

type Key = 'code' | 'parcels' | 'dwell' | 'onTime';
const COLS: { key: Key; label: string }[] = [
  { key: 'code', label: 'Hub' },
  { key: 'parcels', label: 'Parcels · 24h' },
  { key: 'dwell', label: 'Dwell p50' },
  { key: 'onTime', label: 'On time' },
];
const STATUSES: ('All' | HubStatus)[] = ['All', 'Healthy', 'Watch', 'Elevated'];

export default function Hubs() {
  const s = useAgos();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('All');
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'dwell', dir: -1 });

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return HUBS.map((h) => effectiveHub(h, s.rerouted))
      .filter((h) => inRegion(h, s.region))
      .filter((h) => status === 'All' || h.status === status)
      .filter((h) => !needle || `${h.code} ${h.name} ${h.island}`.toLowerCase().includes(needle))
      .sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir);
  }, [q, status, sort, s.region, s.rerouted]);

  const open = s.openHub ? effectiveHub(HUBS.find((h) => h.code === s.openHub)!, s.rerouted) : null;

  return (
    <div className="grid grid--single">
      <section className="card table-card" style={{ '--i': 0 } as React.CSSProperties}>
        <header className="card__head card__head--tools">
          <h2>Hubs</h2>
          <small>{rows.length} shown</small>
          <div className="filters">
            <label className="field">
              <Search size={13} aria-hidden />
              <span className="sr">Filter hubs</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name or code" />
            </label>
            <div className="chips" role="group" aria-label="Status">
              {STATUSES.map((st) => (
                <button key={st} aria-pressed={status === st} onClick={() => setStatus(st)}>
                  {st}
                </button>
              ))}
            </div>
          </div>
        </header>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {COLS.map((c) => (
                  <th key={c.key} aria-sort={sort.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                    <button onClick={() => setSort((p) => ({ key: c.key, dir: p.key === c.key ? (-p.dir as 1 | -1) : -1 }))}>
                      {c.label}
                      {sort.key === c.key && (sort.dir === 1 ? <ArrowUp size={12} aria-hidden /> : <ArrowDown size={12} aria-hidden />)}
                    </button>
                  </th>
                ))}
                <th>Trend</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h, i) => (
                <tr
                  key={h.code}
                  style={{ '--i': i } as React.CSSProperties}
                  className={`${h.status !== 'Healthy' ? 'is-hot' : ''} ${s.openHub === h.code ? 'is-open' : ''}`}
                  onClick={() => s.setOpenHub(h.code)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && s.setOpenHub(h.code)}
                >
                  <td>
                    <code>{h.code.toLowerCase()}</code>
                    <span>
                      {h.name}
                      <small>{h.island}</small>
                    </span>
                  </td>
                  <td className="num">{h.parcels.toLocaleString('en-US')}</td>
                  <td className="num">{h.dwell} min</td>
                  <td className="num">{h.onTime}%</td>
                  <td>
                    <Spark values={hubSeries(h.code, h.dwell)} hot={h.status !== 'Healthy'} />
                  </td>
                  <td>
                    <span className={`status status--${h.status.toLowerCase()}`}>{h.status}</span>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="empty">
                    No hubs match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {open && <Drawer hub={open} onClose={() => s.setOpenHub(null)} />}
    </div>
  );
}

function Drawer({ hub, onClose }: { hub: Hub; onClose: () => void }) {
  const s = useAgos();
  const region = hub.island;
  const series = useMemo(() => dwellSeries(s.range, region, s.rerouted), [s.range, region, s.rerouted]);
  // The regional curves, scaled to this hub's own level.
  const scale = hub.dwell / (series.mid.reduce((a, v) => a + v, 0) / series.mid.length);
  const mid = useMemo(() => series.mid.map((v) => v * scale), [series, scale]);
  const low = useMemo(() => series.low.map((v) => v * scale), [series, scale]);
  const high = useMemo(() => series.high.map((v) => v * scale), [series, scale]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="drawer" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label={`${hub.name} details`}>
        <header>
          <div>
            <code>{hub.code.toLowerCase()}</code>
            <h2>{hub.name}</h2>
            <small>
              {hub.island} · <span className={`status status--${hub.status.toLowerCase()}`}>{hub.status}</span>
            </small>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </header>
        <dl className="drawer__stats">
          <div>
            <dt>Parcels · 24h</dt>
            <dd>{hub.parcels.toLocaleString('en-US')}</dd>
          </div>
          <div>
            <dt>Dwell p50</dt>
            <dd className={hub.status !== 'Healthy' ? 'hot' : ''}>{hub.dwell} min</dd>
          </div>
          <div>
            <dt>On time</dt>
            <dd>{hub.onTime}%</dd>
          </div>
        </dl>
        <h3>Dwell time · {s.range}</h3>
        <LineChart
          mid={mid}
          low={low}
          high={high}
          ticks={series.ticks}
          band={hub.code === 'CEB' || hub.code === 'TAC' ? series.band : null}
          markers={series.markers.filter((m) => !m.hot || hub.code === 'CEB' || hub.code === 'TAC')}
          unit="min"
          names={['p90', 'p50', 'p99']}
          height={200}
        />
        <div className="drawer__actions">
          <button className="btn btn--light" onClick={() => s.toast(`Paged the ${hub.name} shift lead`)}>
            Page shift lead
          </button>
          <button className="btn btn--ghost" onClick={() => s.toast(`${hub.code} added to the 16:30 wave`)}>
            Add to next wave
          </button>
        </div>
      </aside>
    </div>
  );
}
