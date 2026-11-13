'use client';

import { useState } from 'react';
import { Check, Eye } from 'lucide-react';
import { type IncidentStatus } from '../_parts/data';
import { useAgos } from '../_parts/store';

const TABS: ('All' | IncidentStatus)[] = ['All', 'Open', 'Acknowledged', 'Resolved'];

export default function Incidents() {
  const s = useAgos();
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const count = (t: (typeof TABS)[number]) => (t === 'All' ? s.incidents.length : s.incidents.filter((i) => i.status === t).length);
  const list = s.incidents.filter((i) => tab === 'All' || i.status === tab);
  const at = TABS.indexOf(tab);

  return (
    <div className="grid grid--single">
      <section className="card" style={{ '--i': 0 } as React.CSSProperties}>
        <header className="card__head card__head--tools">
          <h2>Incidents</h2>
          <div className="tabs" role="tablist" style={{ '--i': at, '--n': TABS.length } as React.CSSProperties}>
            <span className="tabs__line" aria-hidden />
            {TABS.map((t) => (
              <button key={t} role="tab" aria-selected={t === tab} onClick={() => setTab(t)}>
                {t} <span>{count(t)}</span>
              </button>
            ))}
          </div>
        </header>
        <ol className="timeline">
          {list.map((inc, i) => (
            <li key={inc.id} className={`timeline__item is-${inc.status.toLowerCase()}`} style={{ '--i': i } as React.CSSProperties}>
              <span className="timeline__node" aria-hidden />
              <div className="timeline__body">
                <p className="timeline__meta">
                  <span className={`sev sev--${inc.severity.toLowerCase()}`}>{inc.severity}</span>
                  <code>{inc.id}</code>
                  <span>{inc.hub.toLowerCase()}</span>
                  <span>{inc.started}</span>
                  <span>Owner {inc.owner}</span>
                </p>
                <h3>{inc.title}</h3>
                <p className="timeline__note">{inc.note}</p>
              </div>
              <div className="timeline__side">
                <span className={`status status--${inc.status.toLowerCase()}`}>{inc.status}</span>
                <div className="timeline__actions">
                  {inc.status === 'Open' && (
                    <button className="btn btn--ghost" onClick={() => s.setIncident(inc.id, 'Acknowledged')}>
                      <Eye size={13} aria-hidden /> Acknowledge
                    </button>
                  )}
                  {inc.status !== 'Resolved' && (
                    <button className="btn btn--light" onClick={() => s.setIncident(inc.id, 'Resolved')}>
                      <Check size={13} aria-hidden /> Resolve
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
          {!list.length && <li className="empty">Nothing here. Enjoy the quiet.</li>}
        </ol>
      </section>
    </div>
  );
}
