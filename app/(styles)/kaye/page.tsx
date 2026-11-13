import { Fragment } from 'react';
import { ArrowUpRight, AtSign, Check, Download, Menu, Music2, Camera } from 'lucide-react';
import { ABOUT_CHIPS, BRANDS, FOOTER, MARQUEE, NAV, PACKAGES, SERVICES, STATS, STEPS, TICKER } from './_parts/content';
import { Btn, Heading, Phone, Photo, Squiggle, Sticker } from './_parts/ui';
import { Portfolio } from './_parts/Portfolio';
import { Deck } from './_parts/Deck';
import { BriefForm } from './_parts/BriefForm';

// About paragraph: plain words, accent words (*word*) and stickers ([label]) in reading order.
const ABOUT =
  "I'm Kaye, a food creator from Quezon City making *resto,* *bakeshop* *and* *kapihan* [Ube obsessed] videos that feel like your barkada's food tip, not an ad. Kitchens book me for hooks that stop the scroll, [Hook machine] honest first-bite reviews that build trust, and edits that are ready to post. [Laging camera-ready]";

function AboutText() {
  const tokens = ABOUT.match(/\[[^\]]+\]|\S+/g)!;
  let w = 0;
  return (
    <p className="about__text" data-fill>
      {tokens.map((t, i) => {
        if (t.startsWith('[')) {
          const s = i % 3;
          return (
            <Fragment key={i}>
              <Sticker tone="ube" tilt={[-7, 5, -3][s]} className="sticker--inline" delay={300 + s * 200}>
                {t.slice(1, -1)}
              </Sticker>{' '}
            </Fragment>
          );
        }
        const accent = t.startsWith('*');
        return (
          <Fragment key={i}>
            <span className={`w ${accent ? 'w--accent' : ''}`} data-w={w++}>
              {accent ? t.slice(1, -1) : t}
            </span>{' '}
          </Fragment>
        );
      })}
    </p>
  );
}

const Marquee = ({ items, className = '' }: { items: string[]; className?: string }) => (
  <div className={`marquee ${className}`} aria-hidden>
    <div className="marquee__track">
      {[0, 1].map((k) => (
        <span key={k}>
          {items.map((m) => (
            <span key={m} className="marquee__item">
              {m} <span className="marquee__sep">✦</span>
            </span>
          ))}
        </span>
      ))}
    </div>
  </div>
);

export default function Kaye() {
  return (
    <>
      <header className="top">
        <nav aria-label="Main" className="top__links">
          {NAV.map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`} className="pill">
              {n}
            </a>
          ))}
        </nav>
        <a href="#top" className="wordmark">
          KAYE<span>•</span>EATS
        </a>
        <div className="top__right">
          <span className="top__avail">
            Booking Dec – Feb ’27
            <small>Replies within 24h</small>
          </span>
          <Btn>Let&apos;s Talk</Btn>
        </div>
        <button className="top__menu" popoverTarget="nr-menu" aria-label="Open menu">
          <Menu size={20} strokeWidth={2} />
        </button>
        <div id="nr-menu" popover="auto" className="menu">
          {NAV.map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`}>
              {n}
            </a>
          ))}
          <Btn>Let&apos;s Talk</Btn>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <Squiggle side="left" top="-120px" />
          <Squiggle side="right" top="40px" />
          <div className="hero__head">
            <h1 className="display hero__title">
              <span>Content</span>
              <span>that makes</span>
              <span>you gutom</span>
            </h1>
            <Sticker tilt={-9} className="hero__s1" delay={500}>
              Hi, I&apos;m Kaye Dizon
            </Sticker>
            <Sticker tilt={7} className="hero__s2" delay={650}>
              for Restos &amp; Food brands
            </Sticker>
            <Sticker tone="mango" tilt={-4} className="hero__s3" delay={800}>
              Food creator · QC
            </Sticker>
          </div>
          <div className="hero__grid">
            <div className="hero__intro">
              <p>I make short, crave-worthy videos that feel like your barkada&apos;s food tip, and make people stop, save and book a table.</p>
              <div className="hero__ctas">
                <Btn>Work With Me</Btn>
                <Btn tone="outline">Book a Call</Btn>
              </div>
            </div>
            <div className="hero__phones">
              <Phone className="phone--left">
                <Photo name="p1" />
                <span className="phone__bubble">POV: the longganisa pizza finally drops</span>
              </Phone>
              <Phone className="phone--main">
                <Photo name="kaye" />
                <span className="phone__rec">REC</span>
              </Phone>
              <Phone className="phone--right">
                <Photo name="p3" />
                <span className="phone__bubble">Ensaymada check: sulit ba?</span>
              </Phone>
            </div>
            <div className="hero__stats">
              <div>
                <strong>240+</strong>
                <span>videos shipped</span>
              </div>
              <div>
                <strong>60+</strong>
                <span>happy kitchens</span>
              </div>
              <p>Restos · Bakeshops · Kapihan · Street food</p>
            </div>
          </div>
          <Marquee items={MARQUEE} className="marquee--band" />
        </section>

        {/* ABOUT */}
        <section className="about">
          <Squiggle side="right" top="-60px" />
          <p className="eyebrow" data-reveal>
            A bit about me
          </p>
          <div data-reveal="stickers">
            <AboutText />
          </div>
          <ul className="about__chips" data-reveal>
            {ABOUT_CHIPS.map((c) => (
              <li key={c} className="pill">
                {c}
              </li>
            ))}
          </ul>
        </section>

        {/* WORK */}
        <section className="work" id="work">
          <Squiggle side="left" top="200px" />
          <div className="section-head">
            <div className="section-head__side" data-reveal>
              <p className="eyebrow">Portfolio</p>
              <p>Vertical 9:16 videos made for TikTok, Reels and paid social. Hover a card to play.</p>
            </div>
            <Heading ink="Videos that" accent="fill tables" />
          </div>
          <Portfolio />
        </section>

        {/* BRANDS */}
        <section className="brands">
          <Squiggle side="right" top="0" />
          <div className="section-head">
            <div className="section-head__side" data-reveal>
              <p className="eyebrow">Kitchens I&apos;ve worked with</p>
            </div>
            <Heading ink="60+ kitchens" accent="keep coming back" />
          </div>
          <div className="logos">
            {[BRANDS, [...BRANDS].reverse()].map((row, r) => (
              <div key={r} className={`logos__row ${r ? 'logos__row--rev' : ''}`} aria-hidden={r === 1}>
                <div className="logos__track">
                  {[...row, ...row].map((b, i) => (
                    <span key={i} className={`logo logo--${i % 5}`}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section className="services" id="services">
          <Squiggle side="left" top="-80px" />
          <div className="section-head">
            <div className="section-head__side" data-reveal>
              <p className="eyebrow">Services</p>
              <p>Mix and match. Every package can be tailored to your menu.</p>
            </div>
            <Heading ink="What I" accent="cook up" />
          </div>
          <div className="svc" data-svc>
            <svg className="svc__line" aria-hidden>
              <path className="svc__track" />
              <path className="svc__fill" />
              <circle className="svc__dot" r="9" />
            </svg>
            <ol>
              {SERVICES.map((s, i) => (
                // fade-only reveal: a moving item would shift the anchors the connecting line is built from
                <li key={s.title} className={`svc__item ${i % 2 ? 'svc__item--r' : ''}`} data-reveal="fade">
                  <span className="svc__anchor" />
                  <div>
                    <h3 className="display">{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                  <Photo name={s.photo} className="svc__thumb" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* NUMBERS */}
        <section className="numbers">
          <div className="panel" data-reveal>
            <Squiggle side="right" top="-140px" />
            <div className="section-head section-head--light">
              <div className="section-head__side">
                <p className="eyebrow">Results</p>
                <p>Pretty videos are nice. Videos that move numbers are better.</p>
              </div>
              <h2 className="display">Numbers kitchens care about</h2>
            </div>
            <div className="stats">
              {STATS.map((s, i) => (
                <div key={s.label} className="stat" data-reveal style={{ '--d': `${i * 90}ms` } as React.CSSProperties}>
                  <strong className="display" data-count={s.to} data-decimals={s.decimals} data-suffix={s.suffix}>
                    {s.to.toFixed(s.decimals)}
                    {s.suffix}
                  </strong>
                  <span>{s.label}</span>
                  <small>{s.sub}</small>
                </div>
              ))}
            </div>
            <div className="ticker" aria-label="Recent results">
              <div className="ticker__track">
                {[...TICKER, ...TICKER].map((t, i) => (
                  <span key={i} aria-hidden={i >= TICKER.length}>
                    + {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="love">
          <div className="section-head">
            <div className="section-head__side" data-reveal>
              <p className="eyebrow">Testimonials</p>
            </div>
            <Heading ink="Apparently," accent="they like me" />
          </div>
          <div className="panel panel--deck" data-reveal>
            <Squiggle side="left" top="-80px" />
            <Deck />
          </div>
        </section>

        {/* PRICING */}
        <section className="pricing" id="pricing">
          <Squiggle side="right" top="120px" />
          <div className="section-head">
            <div className="section-head__side" data-reveal>
              <p className="eyebrow">Packages</p>
              <p>Clear starting prices. Every brief gets a tailored quote.</p>
            </div>
            <Heading ink="Pick your" accent="package" />
          </div>
          <div className="plans">
            {PACKAGES.map((p, i) => (
              <article key={p.name} className={`plan ${p.featured ? 'plan--hot' : ''}`} data-reveal style={{ '--d': `${i * 100}ms` } as React.CSSProperties}>
                {p.featured && (
                  <Sticker tone="mango" tilt={8} className="plan__sticker">
                    Most booked
                  </Sticker>
                )}
                <h3 className="display">{p.name}</h3>
                <p className="plan__blurb">{p.blurb}</p>
                <p className="plan__price">
                  <strong className="display">{p.price}</strong> per project
                </p>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>
                      <Check size={12} strokeWidth={3} aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Btn tone={p.featured ? 'ink' : 'outline'}>{p.cta}</Btn>
              </article>
            ))}
          </div>
          <p className="pricing__note" data-reveal>
            Need something custom or a monthly retainer? <a href="#contact">Rates on request →</a>
          </p>
        </section>

        {/* PROCESS (pinned, scrubbed by scroll in both directions) */}
        <section className="process" data-process style={{ '--steps': STEPS.length } as React.CSSProperties}>
          <div className="process__pin">
            <Squiggle side="left" top="-40px" />
            <div className="section-head">
              <div className="section-head__side">
                <p className="eyebrow">Process</p>
                <p>Five simple steps, about five working days. Keep scrolling to walk through them.</p>
              </div>
              <div>
                <h2 className="display">
                  How we&apos;ll <span className="accent">cook</span>
                </h2>
                <p className="process__count">
                  Step <span className="accent" data-step-n>01</span> / 05
                </p>
              </div>
            </div>
            <div className="process__track" aria-hidden>
              <span className="process__fill" />
              {STEPS.map((s) => (
                <span key={s.n} className="process__node" />
              ))}
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li key={s.n} className="step">
                  <span className="step__top">
                    <span className="display step__n">{s.n}</span>
                    <span className="step__day">
                      <Check size={10} strokeWidth={3} aria-hidden /> {s.day}
                    </span>
                  </span>
                  <h3 className="display">{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact" id="contact">
          <Squiggle side="left" top="-100px" />
          <div className="contact__left" data-reveal="stickers">
            <h2 className="display contact__title" data-reveal>
              Gutom for something <span className="accent">together?</span>
            </h2>
            <Sticker tilt={-6} className="contact__sticker" delay={400}>
              o kaya, just say hi!
            </Sticker>
            <ul className="contact__links" data-reveal>
              <li>
                <AtSign size={14} aria-hidden /> hello@kayeeats.ph
              </li>
              <li>
                <Camera size={14} aria-hidden /> Instagram @kaye.eats
              </li>
              <li>
                <Music2 size={14} aria-hidden /> TikTok @kaye.eats
              </li>
            </ul>
            <a href="#top" className="btn btn--outline btn--sm">
              <span>Download media kit</span>
              <span className="btn__dot" aria-hidden>
                <Download size={13} strokeWidth={2.4} />
              </span>
            </a>
          </div>
          <div data-reveal>
            <BriefForm />
          </div>
        </section>
      </main>

      <footer className="foot">
        <Squiggle side="right" top="-60px" />
        <div className="foot__grid">
          <div>
            <h2 className="display foot__title">Okay, busog na sa scrolling.</h2>
            <Btn>Let&apos;s Talk</Btn>
            <p className="foot__mail">
              <small>Email me</small>
              hello@kayeeats.ph
            </p>
          </div>
          <div className="foot__cols">
            <div>
              <small>Menu</small>
              {FOOTER.menu.map((m) => (
                <a key={m} href={`#${m.toLowerCase()}`}>
                  {m}
                </a>
              ))}
            </div>
            <div>
              <small>Follow</small>
              {FOOTER.follow.map((m) => (
                <a key={m} href="#top">
                  {m} <ArrowUpRight size={12} aria-hidden />
                </a>
              ))}
            </div>
            <p className="foot__note">
              Shot on a phone. Plated with love.
              <br />
              Quezon City, PH · Shooting from Batanes to Davao
            </p>
          </div>
        </div>
        <div className="foot__legal">
          <span>© 2026 Kaye Dizon · A fictional creator</span>
          <a href="#top">Back to top ↑</a>
        </div>
        <p className="display foot__giant" aria-hidden>
          KAYE<span>•</span>EATS
        </p>
      </footer>
    </>
  );
}
