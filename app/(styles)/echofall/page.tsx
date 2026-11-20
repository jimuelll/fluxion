import Header from './_parts/Header';
import Icon, { type IconName } from './_parts/Icon';
import Paint from './_parts/Paint';
import Echoes from './_parts/Echoes';

type CSS = React.CSSProperties & Record<`--${string}`, string | number>;
const ART = '/echofall/hero-cut.webp';

const STATS = ['Attack', 'Resonance', 'Mobility'];
const CAST: { name: string; role: string; icon: IconName; line: string; stats: number[]; art?: boolean }[] = [
  { name: 'Lyre', role: 'Resonant', icon: 'resonant', line: 'Cuts with a sound she hasn’t made yet.', stats: [4, 5, 3], art: true },
  { name: 'Halden', role: 'Warden', icon: 'warden', line: 'Keeps the bell tower standing past its last night.', stats: [2, 3, 2] },
  { name: 'Seren', role: 'Seeker', icon: 'seeker', line: 'Reads the tide for words it hasn’t said yet.', stats: [3, 4, 5] },
  { name: 'Wick', role: 'Striker', icon: 'striker', line: 'Hits first and listens to the echo after.', stats: [5, 1, 4] },
];
const REGIONS = [
  { name: 'The Low Choir', text: 'A flooded cathedral district where the hymns keep singing underwater.' },
  { name: 'Static Reach', text: 'Radio towers that broadcast tomorrow’s weather, then yesterday’s.' },
  { name: 'Glass Tide', text: 'A coastline frozen mid-wave, cracked wherever someone fought.' },
];
const NEWS = [
  { date: '2026-11-18', tag: 'Dev letter', title: 'Why every attack in Echofall has its own sound', text: 'Our audio lead on building combat where timing a strike to the music changes what it does, and why we threw out the first three versions.' },
  { date: '2026-11-07', tag: 'Event', title: 'Closed playtest sign-ups are open' },
  { date: '2026-10-29', tag: 'Rewards', title: 'Pre-registration rewards revealed' },
  { date: '2026-10-12', tag: 'Announcement', title: 'Echofall is coming to [PLATFORMS]' },
];
const STILLS = ['The Low Choir at 03:12', 'Lyre mid-strike', 'Static Reach skyline'];
const SIGNUPS = 128400; // placeholder count
const MILESTONES = [
  { at: 100000, reward: '300 echo shards' },
  { at: 250000, reward: 'Profiles for Halden, Seren and Wick' },
  { at: 500000, reward: 'Tidewrack coat outfit for Lyre' },
  { at: 1000000, reward: 'Ten free recruitment pulls' },
];
const fmt = (n: number) => n.toLocaleString('en-US');
const LAST = MILESTONES[MILESTONES.length - 1];
const next = MILESTONES.find((m) => m.at > SIGNUPS) ?? LAST;
// nodes are evenly spaced, so fill is measured node-to-node, not on a linear 0–1M scale
const reachedIdx = MILESTONES.findLastIndex((m) => SIGNUPS >= m.at);
const prev = MILESTONES[reachedIdx];
const trackFill = !prev ? 0 : reachedIdx === MILESTONES.length - 1 ? 100
  : (reachedIdx + (SIGNUPS - prev.at) / (MILESTONES[reachedIdx + 1].at - prev.at)) * (100 / MILESTONES.length);
const SECTIONS: [string, IconName, string, string][] = [
  ['world', 'world', 'World', 'A drowned coast that replays its last day.'],
  ['characters', 'roster', 'Characters', 'Four resonants, one unfinished song.'],
  ['news', 'news', 'News', 'Dev letters, events and patch notes.'],
  ['media', 'media', 'Media', 'Trailer, stills and soundtrack.'],
];

// deterministic waveform so server and client render identical bars
const Wave = ({ bars = 64, className }: { bars?: number; className?: string }) => (
  <svg className={className} viewBox={`0 0 ${bars * 6} 40`} preserveAspectRatio="none" aria-hidden="true">
    {Array.from({ length: bars }, (_, i) => {
      const h = 4 + Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.19)) * 32;
      return <rect key={i} x={i * 6} y={20 - h / 2} width="3" height={h} style={{ '--i': i } as CSS} />;
    })}
  </svg>
);

// map linework shared by the World section and its board preview
const Contours = () => (
  <>
    <g stroke="#4FA7A0" strokeWidth="1.4" opacity=".6">
      <path d="M60 300c40-90 150-160 260-150s150 80 120 150-150 100-250 80S40 360 60 300Z" />
      <path d="M100 290c40-60 120-110 200-100s110 60 90 110-110 70-180 56-130-20-110-66Z" />
      <path d="M150 280c30-36 80-64 140-58s70 40 56 70-70 44-120 34-96-16-76-46Z" />
      <path d="M210 270c20-18 50-30 80-24s30 24 20 38-44 20-70 14-46-12-30-28Z" />
    </g>
    <path d="M0 214C120 196 180 240 300 210s160-34 220-20" stroke="#A4667D" strokeWidth="1.2" strokeDasharray="90 6 40 4" />
  </>
);

const Title = ({ children, id }: { children: string; id: string }) => <h2 className="sec-title" id={id} data-echo={children}>{children}</h2>;

export default function Home() {
  return (
    <>
      <Header />
      <Echoes />
      <main>
        <div className="hero" id="top">
          <Paint />
          <div className="hero-line" aria-hidden="true" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-art" src={ART} width="2348" height="1412" fetchPriority="high" alt="A teal-haired character mid-turn, arm outstretched, her lower half dissolving into sweeping teal and charcoal brushstrokes" />

          <div className="hero-title">
            <h1><span className="t-echo">ECHO</span> <span className="t-fall">FALL</span></h1>
            <p>Every strike leaves a ribbon of sound. Cut through a world that remembers its own ending — and rewrite it one echo at a time.</p>
            <div className="actions">
              <a href="#preregister" className="btn btn-primary">PRE-REGISTER NOW <Icon name="arrow" /></a>
              <a href="#trailer" className="btn btn-ghost"><Icon name="play" /> WATCH TRAILER</a>
            </div>
            <dl className="facts">
              <div><dt>LAUNCH</dt><dd>[LAUNCH DATE]</dd></div>
              <div><dt>PLATFORMS</dt><dd>[PLATFORMS]</dd></div>
            </dl>
          </div>

          <div className="hero-spacer" aria-hidden="true" />
        </div>

        <nav className="board" aria-label="Sections">
          <div className="wrap board-grid">
            <a href="#preregister" className="plate plate-major">
              <Wave className="plate-wave" />
              <span className="mini-track" style={{ '--fill': `${trackFill}%` } as CSS} aria-hidden="true">
                {MILESTONES.map((m) => (
                  <span key={m.at} className={SIGNUPS >= m.at ? 'reached' : undefined}>
                    <i />{m.at >= 1e6 ? `${m.at / 1e6}M` : `${m.at / 1e3}K`}
                  </span>
                ))}
              </span>
              <span className="plate-note"><strong>{fmt(SIGNUPS)}</strong> players have signed up. Next reward at {fmt(next.at)}: {next.reward}.</span>
              <span className="plate-title">Pre-register <Icon name="arrow" size={30} /></span>
              <span className="plate-sub">Sign up once and claim every reward at launch.</span>
            </a>

            <a href="#world" className="plate plate-world">
              <span className="plate-vis">
                <svg viewBox="40 110 460 260" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <Contours />
                  <circle cx="150" cy="285" r="4" fill="#C4123E" /><circle cx="300" cy="120" r="4" fill="#C4123E" /><circle cx="380" cy="330" r="4" fill="#C4123E" />
                </svg>
              </span>
              <span className="plate-title">World</span>
              <span className="plate-sub">Three districts of a coast that replays its last day.</span>
            </a>

            <a href="#characters" className="plate plate-cast">
              <span className="plate-vis">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ART} alt="" loading="lazy" />
              </span>
              <span className="plate-title">Characters</span>
              <span className="plate-sub">Lyre revealed, three to unlock.</span>
            </a>

            <a href="#news" className="plate plate-news">
              <span className="plate-vis">
                <span className="news-meta"><span className="tag">{NEWS[0].tag}</span><time dateTime={NEWS[0].date}>{NEWS[0].date}</time></span>
                <span className="plate-headline">{NEWS[0].title}</span>
              </span>
              <span className="plate-title">News</span>
            </a>

            <a href="#trailer" className="plate plate-media">
              <span className="plate-vis">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ART} alt="" loading="lazy" />
                <span className="play"><Icon name="play" size={20} /></span>
              </span>
              <span className="plate-title">Media</span>
              <span className="plate-sub">Announcement trailer, 1:42.</span>
            </a>

            <a href="#community" className="plate plate-strip">
              <Icon name="community" size={24} />
              <span className="plate-title">Community</span>
              <span className="plate-sub">Join the playtest waitlist and talk to the team.</span>
              <Wave bars={90} className="strip-wave" />
            </a>
          </div>
        </nav>

        <section className="sec" aria-labelledby="world">
          <div className="wrap world-grid">
            <div>
              <Title id="world">World</Title>
              <p className="lede">The coastal city of Vael ends every night at 03:12. The sea rises, the bells crack, and by morning it has all started again. Only the resonants remember the loop, and only they can hear where it breaks.</p>
              <ul className="regions">
                {REGIONS.map((r) => (
                  <li key={r.name}><h3>{r.name}</h3><p>{r.text}</p></li>
                ))}
              </ul>
            </div>
            <figure className="map echo-frame">
              <svg viewBox="0 0 520 420" fill="none" role="img" aria-label="Map of Vael showing the Low Choir, Static Reach and Glass Tide">
                <g stroke="#15181B" opacity=".08">
                  {[80, 160, 240, 320, 400, 480].map((x) => <path key={x} d={`M${x} 20v380`} />)}
                  {[60, 140, 220, 300, 380].map((y) => <path key={y} d={`M20 ${y}h480`} />)}
                </g>
                <Contours />
                {[[150, 285, 'The Low Choir'], [300, 120, 'Static Reach'], [380, 330, 'Glass Tide']].map(([x, y, n]) => (
                  <g key={n} transform={`translate(${x} ${y})`}>
                    <circle r="15" stroke="#2E5F5E" strokeDasharray="4 4" /><circle r="4" fill="#C4123E" />
                    <text x="22" y="5" fill="#15181B" fontSize="15" fontWeight="600">{n}</text>
                  </g>
                ))}
              </svg>
              <figcaption>Survey of Vael, recorded at 03:11</figcaption>
            </figure>
          </div>
        </section>

        <section className="sec" aria-labelledby="characters">
          <div className="wrap">
            <Title id="characters">Characters</Title>
            <ul className="roster">
              {CAST.map((c) => (
                <li key={c.name} className={c.art ? 'op' : 'op op-locked'}>
                  <div className="op-art">
                    {c.art
                      ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={ART} alt={`${c.name}, mid-turn`} loading="lazy" />
                      : <span className="op-lock"><Icon name="roster" size={120} className="op-ghost" /><Icon name="lock" size={22} /><strong>Signal too weak to resolve</strong>{fmt(MILESTONES[1].at - SIGNUPS)} more sign‑ups to unlock</span>}
                  </div>
                  <div className="op-body">
                    <p className="op-role"><Icon name={c.icon} size={20} />{c.role}</p>
                    <h3>{c.name}</h3>
                    <p className="op-line">{c.line}</p>
                    <dl className="op-stats">
                      {STATS.map((s, i) => (
                        <div key={s}>
                          <dt>{s}</dt>
                          <dd><span className="pips" style={{ '--v': c.stats[i] } as CSS} /><span className="sr-only">{c.stats[i]} of 5</span></dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec" aria-labelledby="news">
          <div className="wrap">
            <Title id="news">News</Title>
            <div className="news-grid">
              <article className="news-feature echo-frame">
                <p className="news-meta"><span className="tag">{NEWS[0].tag}</span><time dateTime={NEWS[0].date}>{NEWS[0].date}</time></p>
                <h3><a href="#news">{NEWS[0].title}</a></h3>
                <p>{NEWS[0].text}</p>
                <Wave bars={48} className="news-wave" />
              </article>
              <ul className="news-list">
                {NEWS.slice(1).map((n) => (
                  <li key={n.title}>
                    <p className="news-meta"><span className="tag">{n.tag}</span><time dateTime={n.date}>{n.date}</time></p>
                    <h3><a href="#news">{n.title}</a></h3>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="sec" aria-labelledby="media">
          <div className="wrap">
            <Title id="media">Media</Title>
            <div className="media-grid">
              <a href="#trailer" id="trailer" className="trailer echo-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ART} alt="" loading="lazy" />
                <span className="play"><Icon name="play" size={26} /></span>
                <span className="trailer-cap"><strong>Announcement trailer</strong><span>1:42</span></span>
              </a>
              <ul className="stills">
                {STILLS.map((s) => <li key={s}><span className="still" aria-hidden="true"><Icon name="media" size={22} /></span>{s}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="sec" aria-labelledby="preregister">
          <div className="wrap">
            <Title id="preregister">Pre-register</Title>
            <div className="prereg-head">
              <p className="lede">Sign up once and every reward below is yours at launch. The more players join, the more unlocks for everyone.</p>
              <div className="actions">
                {([['pc', 'PC'], ['console', 'console'], ['mobile', 'mobile']] as const).map(([icon, label]) => (
                  <a key={icon} href="#preregister" className="btn btn-ghost"><Icon name={icon} size={20} />Sign up on {label}</a>
                ))}
              </div>
            </div>
            <ol className="track" style={{ '--fill': `${trackFill}%` } as CSS}>
              {MILESTONES.map((m) => (
                <li key={m.at} className={SIGNUPS >= m.at ? 'reached' : undefined}>
                  <span className="node"><Icon name="shard" size={18} /></span>
                  <strong>{fmt(m.at)}</strong>
                  <span>{m.reward}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="footer" id="community">
        <div className="wrap footer-grid">
          <a href="#top" className="footer-brand">ECHOFALL</a>
          <ul className="footer-links">
            {[...SECTIONS.map(([id, , t]) => [`#${id}`, t]), ['#top', 'Press kit'], ['#top', 'Privacy'], ['#top', 'Terms']].map(([href, t]) => (
              <li key={t}><a href={href}>{t}</a></li>
            ))}
          </ul>
          <p>© 2026 [STUDIO NAME]. All rights reserved. [RATING]</p>
        </div>
      </footer>
    </>
  );
}
