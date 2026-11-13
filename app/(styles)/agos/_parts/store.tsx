'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { INCIDENTS, type Incident, type IncidentStatus, type Range, type Region } from './data';

type Toast = { id: number; text: string };

type Store = {
  range: Range;
  region: Region;
  rerouted: boolean;
  /** True for a moment after a filter change: cards shimmer, then the new data lands. */
  loading: boolean;
  setRange: (r: Range) => void;
  setRegion: (r: Region) => void;
  reroute: () => void;
  incidents: Incident[];
  setIncident: (id: string, status: IncidentStatus) => void;
  toasts: Toast[];
  toast: (text: string) => void;
  openHub: string | null;
  setOpenHub: (code: string | null) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
};

const Ctx = createContext<Store | null>(null);

export function useAgos() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useAgos outside <StoreProvider>');
  return s;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [range, setRangeNow] = useState<Range>('24h');
  const [region, setRegionNow] = useState<Region>('All islands');
  const [rerouted, setRerouted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incidents, setIncidents] = useState(INCIDENTS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [openHub, setOpenHub] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const seq = useRef(0);
  const pending = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((text: string) => {
    const id = ++seq.current;
    setToasts((t) => [...t.slice(-2), { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // A short fake fetch: shimmer first, then swap the data in, so changes read as a load rather than a jump.
  const withLoad = useCallback((apply: () => void) => {
    setLoading(true);
    clearTimeout(pending.current);
    pending.current = setTimeout(() => {
      apply();
      setLoading(false);
    }, 320);
  }, []);

  const value: Store = {
    range,
    region,
    rerouted,
    loading,
    setRange: (r) => r !== range && withLoad(() => setRangeNow(r)),
    setRegion: (r) => r !== region && withLoad(() => setRegionNow(r)),
    reroute: () => {
      if (rerouted) return;
      withLoad(() => setRerouted(true));
      setIncidents((all) => all.map((i) => (i.id === 'INC-2041' && i.status === 'Open' ? { ...i, status: 'Acknowledged' } : i)));
      toast('Rerouting 30% of Cebu volume via Tagbilaran');
    },
    incidents,
    setIncident: (id, status) => {
      setIncidents((all) => all.map((i) => (i.id === id ? { ...i, status } : i)));
      toast(`${id} ${status.toLowerCase()}`);
    },
    toasts,
    toast,
    openHub,
    setOpenHub,
    paletteOpen,
    setPaletteOpen,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
