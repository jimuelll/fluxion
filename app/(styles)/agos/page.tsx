'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CircleCheck, Globe, Map as MapIcon, Package, Send, Timer, TriangleAlert, type LucideIcon } from 'lucide-react';
import { DISPATCHES, HUBS, REROUTE_DISPATCH, dwellSeries, effectiveHub, formatKpi, inRegion, kpiUnit, kpis, type KpiIcon } from './_parts/data';
import { Bars, LineChart, Roll } from './_parts/charts';
import { PhMap } from './_parts/PhMap';
import { CardHead } from './_parts/CardHead';
import { useAgos } from './_parts/store';

const KPI_ICONS: Record<KpiIcon, LucideIcon> = { parcels: Package, timer: Timer, alert: TriangleAlert, check: CircleCheck };

export default function Overview() {
  const s = useAgos();
  const cards = useMemo(() => kpis(s.range, s.region, s.rerouted), [s.range, s.region, s.rerouted]);
  const series = useMemo(() => dwellSeries(s.range, s.region, s.rerouted), [s.range, s.region, s.rerouted]);
  const hubs = useMemo(
    () =>
      HUBS.map((h) => effectiveHub(h, s.rerouted))
        .filter((h) => inRegion(h, s.region))
        .sort((a, b) => b.dwell - a.dwell)
        .slice(0, 5),
    [s.region, s.rerouted],
  );
  const maxDwell = Math.max(...hubs.map((h) => h.dwell)) * 1.15;
  const storm = s.region === 'All islands' || s.region === 'Visayas';
  const visible = HUBS.filter((h) => inRegion(h, s.region)).length;
  const dispatches = s.rerouted ? [REROUTE_DISPATCH, ...DISPATCHES.slice(0, 3)] : DISPATCHES;

  // Live feel: the parcel count creeps up every few seconds while a short range is on screen.
  const [live, setLive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLive((v) => v + 40 + Math.floor(Math.random() * 110)), 2800);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setLive(0), [s.range, s.region]);

  return (
    <div className="ov">
      <section className="card kpis" style={{ '--i': 0 } as React.CSSProperties}>
        {cards.map((c, i) => {
          const Icon = KPI_ICONS[c.icon];
          return (
            <div key={c.label} className="kpi">
              <p className="kpi__label">
                <Icon size={15} strokeWidth={1.7} aria-hidden /> {c.label}
              </p>
              <p className="kpi__value">
                <Roll value={c.value + (i === 0 && (s.range === '1h' || s.range === '24h') ? live : 0)} format={(v) => formatKpi(v, c.format)} />
                <small>{kpiUnit(c.format)}</small>
              </p>
              <p className="kpi__foot">
                <b className={c.good ? '' : 'hot'}>{c.delta}</b> {c.ctx}
              </p>
              <Bars values={c.bars} hot={c.hot} />
            </div>
          );
        })}
      </section>

      <section className="card map-card" style={{ '--i': 1 } as React.CSSProperties}>
        <CardHead icon={MapIcon} title="Hub network" sub={`${visible} hubs · 412k parcels/h`}>
          <span className="live">
            <i /> Live
          </span>
          <span className="legend">
            <span>
              <i className="dot dot--ok" /> On schedule
            </span>
            <span>
              <i className="dot dot--hot" /> Delayed
            </span>
          </span>
        </CardHead>
        <PhMap region={s.region} rerouted={s.rerouted} />
      </section>

      <section className="card chart-card" style={{ '--i': 2 } as React.CSSProperties}>
        <CardHead icon={Timer} title="Hub dwell time" sub={`${s.region.toLowerCase()} · ${s.range}`}>
          <span className="legend">
            <span>
              <i className="key key--mid" /> p90
            </span>
            <span>
              <i className="key key--low" /> p50
            </span>
            <span>
              <i className="key key--high" /> p99
            </span>
          </span>
        </CardHead>
        <LineChart
          mid={series.mid}
          low={series.low}
          high={series.high}
          ticks={series.ticks}
          band={series.band}
          bandLabel={series.bandLabel}
          markers={series.markers}
          unit="min"
          names={['p90', 'p50', 'p99']}
        />
      </section>

      <section className="card hubs-card" style={{ '--i': 3 } as React.CSSProperties}>
        <CardHead icon={Globe} title="Hubs" sub={String(visible)}>
          <Link href="/agos/hubs/" className="card__more">
            All <ArrowUpRight size={13} aria-hidden />
          </Link>
        </CardHead>
        {storm && (
          <div className={`insight ${s.rerouted ? 'is-done' : ''}`}>
            <p className="insight__title">{s.rerouted ? 'Cebu is recovering' : 'ceb dwell is 2.8x its baseline'}</p>
            <p className="insight__body">
              {s.rerouted
                ? 'Tagbilaran is taking 30% of inbound volume. Dwell is back under an hour.'
                : 'Since Signal No. 2 at 13:52. tag has 41% spare sort capacity at 30 min.'}
            </p>
            {!s.rerouted && (
              <div className="insight__actions">
                <button className="btn btn--light" onClick={s.reroute}>
                  Shift 30% to tag
                </button>
                <Link className="btn btn--ghost" href="/agos/incidents/">
                  Open incident
                </Link>
              </div>
            )}
          </div>
        )}
        <ul className="hublist">
          {hubs.map((h) => (
            <li key={h.code} className={h.status === 'Elevated' || h.dwell > 50 ? 'is-hot' : ''}>
              <code>{h.code.toLowerCase()}</code>
              <span>{h.name}</span>
              <span className="hublist__bar">
                <i style={{ width: `${(h.dwell / maxDwell) * 100}%` }} />
              </span>
              <b>
                {h.dwell}
                <small>min</small>
              </b>
            </li>
          ))}
        </ul>
      </section>

      <section className="card disp-card" style={{ '--i': 4 } as React.CSSProperties}>
        <CardHead icon={Send} title="Dispatches">
          <Link href="/agos/incidents/" className="card__more">
            All <ArrowUpRight size={13} aria-hidden />
          </Link>
        </CardHead>
        <ul className="disp">
          {dispatches.map((d) => (
            <li key={d.id}>
              <span className={`disp__dot disp__dot--${d.tone}`} aria-hidden />
              <span className="disp__main">
                <strong>{d.title}</strong>
                <code>{d.meta}</code>
              </span>
              <span className="disp__side">
                <span className="avatar">{d.who}</span>
                <small>{d.ago}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
