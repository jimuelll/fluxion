// Fake but plausible data for a fictional Philippine courier network. Seeded, so every visit looks the same.

export type Range = '1h' | '24h' | '7d' | '30d';
export type Region = 'All islands' | 'Luzon' | 'Visayas' | 'Mindanao';
export type Island = Exclude<Region, 'All islands'>;
export type HubStatus = 'Healthy' | 'Watch' | 'Elevated';

export const RANGES: Range[] = ['1h', '24h', '7d', '30d'];
export const REGIONS: Region[] = ['All islands', 'Luzon', 'Visayas', 'Mindanao'];

export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hashStr = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);

export type Hub = {
  code: string;
  name: string;
  island: Island;
  lon: number;
  lat: number;
  parcels: number; // per 24h
  dwell: number; // median minutes a parcel sits in the hub
  onTime: number; // %
  status: HubStatus;
};

export const HUBS: Hub[] = [
  { code: 'MNL', name: 'Manila Gateway', island: 'Luzon', lon: 121.0, lat: 14.6, parcels: 61200, dwell: 31, onTime: 96.4, status: 'Healthy' },
  { code: 'CRK', name: 'Clark Sortation', island: 'Luzon', lon: 120.55, lat: 15.2, parcels: 22400, dwell: 28, onTime: 97.1, status: 'Healthy' },
  { code: 'BAG', name: 'Baguio', island: 'Luzon', lon: 120.6, lat: 16.4, parcels: 6100, dwell: 36, onTime: 94.8, status: 'Healthy' },
  { code: 'LAO', name: 'Laoag', island: 'Luzon', lon: 120.6, lat: 18.2, parcels: 2900, dwell: 39, onTime: 93.9, status: 'Healthy' },
  { code: 'NAG', name: 'Naga', island: 'Luzon', lon: 123.2, lat: 13.6, parcels: 5400, dwell: 41, onTime: 92.7, status: 'Watch' },
  { code: 'PPS', name: 'Puerto Princesa', island: 'Luzon', lon: 118.75, lat: 9.75, parcels: 3300, dwell: 44, onTime: 91.6, status: 'Healthy' },
  { code: 'ILO', name: 'Iloilo', island: 'Visayas', lon: 122.55, lat: 10.7, parcels: 9800, dwell: 35, onTime: 95.2, status: 'Healthy' },
  { code: 'BCD', name: 'Bacolod', island: 'Visayas', lon: 122.95, lat: 10.65, parcels: 7200, dwell: 33, onTime: 95.8, status: 'Healthy' },
  { code: 'CEB', name: 'Cebu Mega Hub', island: 'Visayas', lon: 123.9, lat: 10.3, parcels: 24800, dwell: 104, onTime: 81.2, status: 'Elevated' },
  { code: 'TAG', name: 'Tagbilaran', island: 'Visayas', lon: 123.85, lat: 9.65, parcels: 3600, dwell: 30, onTime: 96.9, status: 'Healthy' },
  { code: 'TAC', name: 'Tacloban', island: 'Visayas', lon: 125.0, lat: 11.25, parcels: 4100, dwell: 58, onTime: 88.4, status: 'Watch' },
  { code: 'CGY', name: 'Cagayan de Oro', island: 'Mindanao', lon: 124.65, lat: 8.48, parcels: 8300, dwell: 34, onTime: 95.4, status: 'Healthy' },
  { code: 'DVO', name: 'Davao', island: 'Mindanao', lon: 125.6, lat: 7.1, parcels: 14900, dwell: 32, onTime: 96.1, status: 'Healthy' },
  { code: 'ZAM', name: 'Zamboanga', island: 'Mindanao', lon: 122.07, lat: 6.92, parcels: 4300, dwell: 37, onTime: 94.2, status: 'Healthy' },
  { code: 'GES', name: 'General Santos', island: 'Mindanao', lon: 125.17, lat: 6.11, parcels: 3800, dwell: 35, onTime: 95.0, status: 'Healthy' },
];

export const ROUTES: [string, string][] = [
  ['MNL', 'CEB'], ['MNL', 'DVO'], ['MNL', 'ILO'], ['MNL', 'PPS'], ['MNL', 'NAG'], ['MNL', 'CRK'], ['CRK', 'BAG'], ['BAG', 'LAO'],
  ['CEB', 'DVO'], ['CEB', 'TAC'], ['CEB', 'CGY'], ['CEB', 'TAG'], ['ILO', 'BCD'], ['BCD', 'CEB'], ['DVO', 'GES'], ['CGY', 'ZAM'],
];

/** Hub after the "reroute 30% via Tagbilaran" action: Cebu calms down, Tagbilaran picks up the load. */
export function effectiveHub(h: Hub, rerouted: boolean): Hub {
  if (!rerouted) return h;
  if (h.code === 'CEB') return { ...h, parcels: Math.round(h.parcels * 0.7), dwell: 49, onTime: 91.8, status: 'Watch' };
  if (h.code === 'TAG') return { ...h, parcels: h.parcels + Math.round(24800 * 0.3), dwell: 38, onTime: 95.6 };
  return h;
}

export const inRegion = (h: Hub, region: Region) => region === 'All islands' || h.island === region;

// Simplified island outlines as [lon, lat] rings, good enough for a dot-matrix silhouette.
export const ISLANDS: [number, number][][] = [
  // Luzon
  [[120.6, 18.5], [121.2, 18.6], [122.2, 18.5], [122.3, 17.3], [122.5, 16.3], [121.6, 15.8], [121.6, 14.9], [121.9, 14.2], [122.6, 14.3], [123.1, 13.9], [123.9, 13.8], [124.2, 13.0], [123.9, 12.6], [123.3, 13.0], [122.6, 13.3], [122.0, 13.6], [121.4, 13.6], [120.9, 13.9], [120.6, 14.4], [120.6, 14.8], [120.1, 14.9], [119.8, 15.9], [120.3, 16.1], [120.4, 17.0], [120.4, 18.0]],
  // Mindoro
  [[120.3, 13.5], [121.0, 13.5], [121.5, 13.1], [121.4, 12.3], [121.0, 12.2], [120.7, 12.6], [120.3, 13.2]],
  // Palawan
  [[117.2, 8.4], [117.6, 8.4], [118.8, 9.7], [119.7, 10.6], [119.6, 11.3], [119.2, 11.0], [118.4, 10.0], [117.5, 9.0]],
  // Panay
  [[121.9, 11.9], [122.7, 11.6], [123.1, 11.1], [122.5, 10.6], [122.0, 10.5], [121.9, 11.2]],
  // Negros
  [[122.5, 10.9], [123.2, 11.0], [123.5, 10.4], [123.3, 9.3], [123.0, 9.1], [122.4, 9.7], [122.4, 10.4]],
  // Cebu
  [[123.9, 11.2], [124.1, 11.1], [124.0, 10.4], [123.6, 9.6], [123.4, 9.9], [123.7, 10.6]],
  // Bohol
  [[123.8, 10.1], [124.4, 10.1], [124.6, 9.8], [124.3, 9.6], [123.8, 9.7]],
  // Leyte
  [[124.3, 11.5], [125.0, 11.3], [125.2, 10.6], [125.0, 10.0], [124.7, 10.1], [124.6, 10.8], [124.3, 11.0]],
  // Samar
  [[124.3, 12.5], [125.3, 12.5], [125.7, 11.5], [125.6, 11.0], [125.0, 11.1], [124.6, 11.5], [124.3, 12.0]],
  // Masbate
  [[123.2, 12.4], [123.9, 12.3], [123.6, 11.9], [123.2, 12.0]],
  // Mindanao
  [[122.0, 7.0], [122.1, 7.6], [123.0, 8.0], [123.7, 8.6], [124.6, 8.6], [125.2, 9.0], [125.5, 9.7], [126.1, 9.3], [126.4, 8.3], [126.5, 7.3], [126.1, 6.3], [125.5, 5.6], [125.2, 6.0], [124.6, 6.0], [124.0, 6.4], [124.0, 7.2], [123.4, 7.6], [122.8, 7.4], [122.3, 6.9]],
];

const N = 72; // every series has the same length, so switching ranges can morph point-for-point

const TICKS: Record<Range, string[]> = {
  '1h': ['−60m', '−45m', '−30m', '−15m', 'now'],
  '24h': ['00:00', '06:00', '12:00', '18:00', 'now'],
  '7d': ['Mon', 'Wed', 'Fri', 'Sun', 'now'],
  '30d': ['Oct 15', 'Oct 22', 'Oct 29', 'Nov 5', 'now'],
};
const CYCLES: Record<Range, number> = { '1h': 0.15, '24h': 1, '7d': 7, '30d': 10 };
const SCALE: Record<Range, number> = { '1h': 1 / 24, '24h': 1, '7d': 6.6, '30d': 27.8 };

export type Marker = { i: number; label: string; hot?: boolean };
export type Series = {
  mid: number[]; // p90, the headline line
  low: number[]; // p50
  high: number[]; // p99, dotted
  ticks: { i: number; label: string }[];
  band: [number, number] | null;
  bandLabel: string;
  markers: Marker[];
};

/** Hub dwell time in minutes, with the typhoon anomaly when the Visayas are in view. */
export function dwellSeries(range: Range, region: Region, rerouted: boolean): Series {
  const r = rng(hashStr(range + region));
  const base = { 'All islands': 34, Luzon: 31, Visayas: 38, Mindanao: 33 }[region];
  const storm = region === 'All islands' || region === 'Visayas';
  const at = N * 0.6;
  const width = range === '30d' ? 2 : range === '7d' ? 2.6 : 3.4;
  const peak = (region === 'Visayas' ? 62 : 46) * (rerouted ? 0.3 : 1);
  const mid: number[] = [];
  const low: number[] = [];
  const high: number[] = [];
  for (let i = 0; i < N; i++) {
    const wave = Math.sin((i / N) * Math.PI * 2 * CYCLES[range] - 1.2) * 2.2;
    const bump = storm ? peak * Math.exp(-((i - at) ** 2) / (2 * width * width)) : 0;
    mid.push(base + wave + (r() - 0.5) * 3.4 + bump);
    low.push(base * 0.5 + wave * 0.4 + (r() - 0.5) * 1.2 + bump * 0.06);
    high.push(base * 1.8 + wave * 1.3 + (r() - 0.5) * 5 + bump * 1.85);
  }
  const ticks = TICKS[range].map((label, k) => ({ i: Math.round((k / 4) * (N - 1)), label }));
  const markers: Marker[] = [
    { i: Math.round(N * 0.2), label: 'Wave 2 dispatched' },
    storm
      ? { i: Math.round(at - width * 2.6), label: 'Signal No. 2 raised · Cebu', hot: !rerouted }
      : { i: Math.round(at - width * 2.6), label: 'Wave 3 dispatched' },
    { i: Math.round(N * 0.84), label: storm && rerouted ? 'Reroute via Tagbilaran' : 'Ferry MV Lorenzo departed' },
  ];
  return {
    mid,
    low,
    high,
    ticks,
    band: storm ? [Math.round(at - width * 2.2), Math.round(at + width * 2.2)] : null,
    bandLabel: rerouted ? 'ceb · recovering' : 'ceb · dwell elevated',
    markers,
  };
}

export type KpiIcon = 'parcels' | 'timer' | 'alert' | 'check';
export type Kpi = { label: string; icon: KpiIcon; value: number; format: 'compact' | 'min' | 'pct' | 'pct2'; delta: string; good: boolean; ctx: string; bars: number[]; hot: number[] };

export function kpis(range: Range, region: Region, rerouted: boolean): Kpi[] {
  const hubs = HUBS.map((h) => effectiveHub(h, rerouted)).filter((h) => inRegion(h, region));
  const parcels = hubs.reduce((a, h) => a + h.parcels, 0) * SCALE[range];
  const w = (k: 'dwell' | 'onTime') => hubs.reduce((a, h) => a + h[k] * h.parcels, 0) / hubs.reduce((a, h) => a + h.parcels, 0);
  const dwell = w('dwell');
  const onTime = w('onTime');
  const failed = Math.max(0.4, (100 - onTime) * 0.31);
  const alert = (region === 'All islands' || region === 'Visayas') && !rerouted;
  const r = rng(hashStr(range + region + 'kpi'));
  const flat = (lo: number) => Array.from({ length: 14 }, () => lo + r() * 0.14);
  const spike = (bars: number[], at: number[], to: number) => bars.map((v, i) => (at.includes(i) ? to : v));
  return [
    { label: 'Parcels moved', icon: 'parcels', value: parcels, format: 'compact', delta: '+8.6%', good: true, ctx: `last ${range}`, bars: Array.from({ length: 14 }, (_, i) => 0.28 + (i / 13) * 0.6 + r() * 0.1), hot: [] },
    { label: 'Median hub dwell', icon: 'timer', value: dwell, format: 'min', delta: alert ? '+14 min' : '+2 min', good: !alert, ctx: 'all hubs', bars: spike(flat(0.16), [8, 9], alert ? 1 : 0.42), hot: alert ? [8, 9] : [] },
    { label: 'Failed deliveries', icon: 'alert', value: failed, format: 'pct2', delta: alert ? '+0.41 pt' : '−0.08 pt', good: !alert, ctx: 'of attempts', bars: spike(flat(0.2), [9, 10], alert ? 0.9 : 0.36), hot: alert ? [9, 10] : [] },
    { label: 'On-time rate', icon: 'check', value: onTime, format: 'pct', delta: alert ? '−3.2 pt' : '+0.4 pt', good: !alert, ctx: 'SLA 95%', bars: spike(flat(0.72), [8, 9], alert ? 0.22 : 0.6), hot: alert ? [8, 9] : [] },
  ];
}

export function formatKpi(v: number, f: Kpi['format']) {
  if (f === 'compact') return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(v);
  if (f === 'min') return `${v.toFixed(0)}`;
  if (f === 'pct2') return v.toFixed(2);
  return v.toFixed(1);
}
export const kpiUnit = (f: Kpi['format']) => (f === 'min' ? 'min' : f === 'compact' ? '' : '%');

/** A small per-hub series for sparklines and the hub drawer. */
export function hubSeries(code: string, dwell: number, n = 32) {
  // Calm baseline with a little texture; delayed hubs get one clear bump, like a real incident would.
  const r = rng(hashStr(code));
  const hot = dwell > 50;
  return Array.from({ length: n }, (_, i) => {
    const base = (hot ? 36 : dwell) * (1 + Math.sin(i / 3.5) * 0.03 + (r() - 0.5) * 0.05);
    return base + (hot ? (dwell - 30) * Math.exp(-((i - n * 0.55) ** 2) / (2 * (n * 0.08) ** 2)) : 0);
  });
}

export type IncidentStatus = 'Open' | 'Acknowledged' | 'Resolved';
export type Incident = { id: string; title: string; hub: string; severity: 'High' | 'Medium' | 'Low'; started: string; status: IncidentStatus; owner: string; note: string };

export const INCIDENTS: Incident[] = [
  { id: 'INC-2041', title: 'Cebu Mega Hub dwell time is 2.8× its baseline', hub: 'CEB', severity: 'High', started: 'Today, 13:52', status: 'Open', owner: 'M. Reyes', note: 'Signal No. 2 halted two inbound ferries. Sort lines are backing up.' },
  { id: 'INC-2040', title: 'Tacloban line-haul held by Signal No. 2', hub: 'TAC', severity: 'Medium', started: 'Today, 12:10', status: 'Open', owner: 'J. Santos', note: 'Trucks staged at Ormoc until the coast guard clears the route.' },
  { id: 'INC-2038', title: 'Scanner outage on Iloilo sort line 3', hub: 'ILO', severity: 'Medium', started: 'Today, 09:41', status: 'Acknowledged', owner: 'A. Villanueva', note: 'Manual scanning in place. Replacement unit arriving 15:00.' },
  { id: 'INC-2036', title: 'Naga rider app sync lag', hub: 'NAG', severity: 'Low', started: 'Today, 08:05', status: 'Acknowledged', owner: 'R. Bautista', note: 'Proofs of delivery uploading 6–9 minutes late.' },
  { id: 'INC-2035', title: 'Davao ferry cut-off missed (MV Lorenzo)', hub: 'DVO', severity: 'Medium', started: 'Yesterday, 21:30', status: 'Resolved', owner: 'K. Dizon', note: 'Parcels moved to the 05:00 sailing. No SLA breach.' },
  { id: 'INC-2033', title: 'Address validation errors spike in Quezon City', hub: 'MNL', severity: 'Low', started: 'Yesterday, 16:12', status: 'Resolved', owner: 'P. Reyes', note: 'Barangay boundary update rolled back.' },
];

export type Dispatch = { id: string; title: string; meta: string; who: string; ago: string; tone: 'live' | 'hot' | 'done' };

export const DISPATCHES: Dispatch[] = [
  { id: 'W-2046', title: 'Wave 4 out of Manila Gateway', meta: '#W-2046 · mnl · 1,240 parcels', who: 'MR', ago: '14m', tone: 'live' },
  { id: 'W-2043', title: 'Ferry Cebu → Tacloban held by Signal No. 2', meta: '#W-2043 · ceb → tac · 88 pallets', who: 'JS', ago: '3h', tone: 'hot' },
  { id: 'W-2041', title: 'Line-haul Clark → Baguio departed', meta: '#W-2041 · crk → bag · 312 parcels', who: 'AV', ago: '7h', tone: 'done' },
  { id: 'W-2038', title: 'Davao cut-off moved to the 05:00 sailing', meta: '#W-2038 · dvo → ges · 96 parcels', who: 'KD', ago: '12h', tone: 'done' },
];
export const REROUTE_DISPATCH: Dispatch = { id: 'W-2047', title: 'Reroute 30% of Cebu inbound via Tagbilaran', meta: '#W-2047 · ceb → tag · 7.4k parcels', who: 'YOU', ago: 'now', tone: 'live' };
