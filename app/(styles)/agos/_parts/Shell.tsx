'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight, Bell, ChevronDown, ChevronsUpDown, LayoutGrid, Search, TriangleAlert, Warehouse } from 'lucide-react';
import { HUBS, RANGES, REGIONS, type Region } from './data';
import { StoreProvider, useAgos } from './store';

const NAV = [
  { href: '/agos/', label: 'Overview', icon: LayoutGrid },
  { href: '/agos/hubs/', label: 'Hubs', icon: Warehouse },
  { href: '/agos/incidents/', label: 'Incidents', icon: TriangleAlert },
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Frame>{children}</Frame>
    </StoreProvider>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const s = useAgos();
  const active = NAV.find((n) => n.href.replace(/\/$/, '') === path.replace(/\/$/, '')) ?? NAV[0];
  const open = s.incidents.filter((i) => i.status === 'Open').length;

  // ⌘K / Ctrl+K anywhere opens the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        s.setPaletteOpen(!s.paletteOpen);
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [s]);

  return (
    <div className="app">
      <aside className="side">
        <button className="team" onClick={() => s.toast('Only one team in this demo')}>
          <span className="team__logo">A</span>
          <span>
            <strong>Agos Logistics</strong>
            <small>Network ops · PH</small>
          </span>
          <ChevronsUpDown size={14} aria-hidden />
        </button>
        <SideNav active={active.href} openIncidents={open} />
        <p className="side__label">Island groups</p>
        <ul className="side__groups">
          {(['Luzon', 'Visayas', 'Mindanao'] as Region[]).map((g) => (
            <li key={g}>
              <button className={s.region === g ? 'is-on' : ''} onClick={() => s.setRegion(s.region === g ? 'All islands' : g)}>
                <span className={`dot ${g === 'Visayas' && !s.rerouted ? 'dot--hot' : 'dot--grey'}`} />
                {g}
              </button>
            </li>
          ))}
        </ul>
        <div className="side__meter">
          <p>
            Fleet dispatched <span>Nov</span>
          </p>
          <p className="side__meter-val">
            1,804 <span>/ 2,500 vans</span>
          </p>
          <span className="meter">
            <i style={{ width: '72%' }} />
          </span>
        </div>
      </aside>

      <div className="main">
        <header className="top">
          <nav className="crumbs" aria-label="Breadcrumb">
            <span>Agos</span>
            <span>/</span>
            <span>Philippines</span>
            <span>/</span>
            <span aria-current="page">{active.label}</span>
          </nav>
          <div className="top__tools">
            <button className="search" onClick={() => s.setPaletteOpen(true)}>
              <Search size={15} aria-hidden /> Search
              <kbd>⌘K</kbd>
            </button>
            <Link className="icon-btn" href="/agos/incidents/" aria-label={`${open} open incidents`}>
              <Bell size={17} strokeWidth={1.7} />
              {open > 0 && <span className="icon-btn__dot" />}
            </Link>
          </div>
        </header>

        <div className="head">
          <div className="head__title">
            <h1>ph-network</h1>
            <span className="env">
              <i /> Production
            </span>
            <a className="head__link" href="#" onClick={(e) => e.preventDefault()}>
              ops.agos.ph <ArrowUpRight size={13} aria-hidden />
            </a>
          </div>
          <div className="head__tools">
            <Segmented />
            <label className="select">
              <span className="sr">Island group</span>
              <select value={s.region} onChange={(e) => s.setRegion(e.target.value as Region)}>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <ChevronDown size={14} aria-hidden />
            </label>
            <button className="btn btn--primary" onClick={() => s.toast('Dispatch wave queued for 16:30')}>
              Dispatch
            </button>
          </div>
        </div>

        <main className={`view ${s.loading ? 'is-loading' : ''}`} key={active.href}>
          {children}
        </main>
      </div>

      <nav className="tabbar" aria-label="Views">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={n.href === active.href ? 'is-on' : ''}>
            <n.icon size={18} aria-hidden />
            {n.label}
          </Link>
        ))}
      </nav>

      <Palette />
      <div className="toasts" aria-live="polite">
        {s.toasts.map((t) => (
          <div key={t.id} className="toast">
            <span className="dot dot--ok" /> {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Sidebar links with one highlight that slides to the active item. */
function SideNav({ active, openIncidents }: { active: string; openIncidents: number }) {
  const list = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ top: number; height: number } | null>(null);
  useLayoutEffect(() => {
    const el = list.current?.querySelector<HTMLElement>(`[data-href="${active}"]`);
    if (el) setPill({ top: el.offsetTop, height: el.offsetHeight });
  }, [active]);
  return (
    <ul className="side__nav" ref={list}>
      {pill && <span className="side__pill" style={{ transform: `translateY(${pill.top}px)`, height: pill.height }} aria-hidden />}
      {NAV.map((n) => (
        <li key={n.href} data-href={n.href}>
          <Link href={n.href} aria-current={n.href === active ? 'page' : undefined}>
            <n.icon size={17} strokeWidth={1.6} aria-hidden />
            {n.label}
            {n.label === 'Incidents' && openIncidents > 0 && <span className="badge">{openIncidents}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Range picker whose thumb slides between options. */
function Segmented() {
  const s = useAgos();
  const i = RANGES.indexOf(s.range);
  return (
    <div className="seg" role="radiogroup" aria-label="Time range" style={{ '--i': i, '--n': RANGES.length } as React.CSSProperties}>
      <span className="seg__thumb" aria-hidden />
      {RANGES.map((r) => (
        <button key={r} role="radio" aria-checked={r === s.range} onClick={() => s.setRange(r)}>
          {r}
        </button>
      ))}
    </div>
  );
}

function Palette() {
  const s = useAgos();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const items = useMemo(() => {
    const all = [
      ...NAV.map((n) => ({ key: n.href, label: `Go to ${n.label}`, hint: 'View', run: () => router.push(n.href) })),
      ...HUBS.map((h) => ({
        key: h.code,
        label: `${h.name}`,
        hint: h.code,
        run: () => {
          s.setOpenHub(h.code);
          router.push('/agos/hubs/');
        },
      })),
      ...RANGES.map((r) => ({ key: `r${r}`, label: `Show last ${r}`, hint: 'Range', run: () => s.setRange(r) })),
    ];
    const needle = q.trim().toLowerCase();
    return needle ? all.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(needle)) : all;
  }, [q, router, s]);

  useEffect(() => {
    if (s.paletteOpen) {
      setQ('');
      setSel(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [s.paletteOpen]);

  if (!s.paletteOpen) return null;
  const close = () => s.setPaletteOpen(false);
  const run = (i: number) => {
    items[i]?.run();
    close();
  };

  return (
    <div className="palette" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="palette__box" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette__input">
          <Search size={16} aria-hidden />
          <input
            ref={input}
            value={q}
            placeholder="Jump to a hub, view or range…"
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') close();
              if (e.key === 'ArrowDown') setSel((v) => Math.min(items.length - 1, v + 1));
              if (e.key === 'ArrowUp') setSel((v) => Math.max(0, v - 1));
              if (e.key === 'Enter') run(sel);
            }}
            aria-label="Search"
          />
          <kbd>esc</kbd>
        </div>
        <ul className="palette__list" role="listbox">
          {items.slice(0, 9).map((it, i) => (
            <li key={it.key} role="option" aria-selected={i === sel} onMouseEnter={() => setSel(i)} onClick={() => run(i)}>
              <span>{it.label}</span>
              <small>{it.hint}</small>
            </li>
          ))}
          {!items.length && <li className="palette__empty">No matches</li>}
        </ul>
      </div>
    </div>
  );
}
