// Echofall icon set: 24px grid, 1.6 stroke, each glyph carries a small "echo" arc or offset mark.
const paths: Record<string, React.ReactNode> = {
  world: <><circle cx="11" cy="13" r="7.5" /><path d="M3.5 13h15M11 5.5c-2.6 2-2.6 13 0 15M11 5.5c2.6 2 2.6 13 0 15" /><path d="M18 3.2a9.6 9.6 0 0 1 3 4.3" /></>,
  roster: <><circle cx="10" cy="8" r="3.4" /><path d="M3.5 20.5c0-3.8 2.9-6.4 6.5-6.4s6.5 2.6 6.5 6.4" /><path d="M16.6 5a5 5 0 0 1 0 6.4M19.3 3a8.4 8.4 0 0 1 0 10.4" /></>,
  news: <><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v4h4M8 11h8M8 14h8M8 17h4.5" /><path d="M2.5 6v15.5" /></>,
  media: <><rect x="3" y="5" width="16" height="13" /><path d="M10 9.2v5.6l4.6-2.8z" /><path d="M6 21h15V8" /></>,
  signal: <><circle cx="12" cy="12" r="1.6" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6M5.3 5.3a9.5 9.5 0 0 0 0 13.4M18.7 5.3a9.5 9.5 0 0 1 0 13.4" /></>,
  shard: <><path d="M12 2.5 18 10l-6 11.5L6 10z" /><path d="M6 10h12M12 2.5V21.5" /><path d="M20 4.5l1.5 1.5" /></>,
  community: <><path d="M3.5 5h11v8H8l-4.5 3.2z" /><path d="M17 9h3.5v8.5L17 15.6h-5v-2.6" /></>,
  striker: <><path d="M4 20 18 6M14.5 3.5l6 6M6 14.5l3.5 3.5" /><path d="M20.5 15a6 6 0 0 1-5.5 5.5" /></>,
  warden: <><path d="M12 3l7 3v5.2c0 4.8-3 8-7 9.8-4-1.8-7-5-7-9.8V6z" /><path d="M12 8v8M9 11h6" /></>,
  resonant: <><path d="M2.5 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0" /><path d="M2.5 17.5c2-2.4 4-2.4 6 0" /></>,
  seeker: <><circle cx="12" cy="12" r="6" /><path d="M12 2.5V7M12 17v4.5M2.5 12H7M17 12h4.5" /><circle cx="12" cy="12" r="1.2" /></>,
  pc: <><path d="M3 4.5h18v11H3z" /><path d="M9 20h6M12 15.5V20" /></>,
  console: <><path d="M6.5 8.5h11a3.5 3.5 0 0 1 3.4 4.2l-.8 3.9a2.2 2.2 0 0 1-3.9.9L14.6 16H9.4l-1.6 1.5a2.2 2.2 0 0 1-3.9-.9l-.8-3.9a3.5 3.5 0 0 1 3.4-4.2z" /><path d="M8.5 11v3M7 12.5h3" /><circle cx="15.8" cy="12.5" r=".9" /></>,
  mobile: <><rect x="7" y="2.5" width="10" height="19" rx="1.5" /><path d="M11 18.5h2" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  play: <path d="M7 4l13 8-13 8z" />,
  lock: <><rect x="5" y="10.5" width="14" height="10" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>,
};

export type IconName = 'world' | 'roster' | 'news' | 'media' | 'signal' | 'shard' | 'community' | 'striker' | 'warden' | 'resonant' | 'seeker' | 'pc' | 'console' | 'mobile' | 'arrow' | 'play' | 'lock';

export default function Icon({ name, size = 18, ...p }: { name: IconName; size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      {paths[name]}
    </svg>
  );
}
