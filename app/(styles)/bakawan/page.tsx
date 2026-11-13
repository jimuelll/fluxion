import { ArrowUpRight, Menu, Plus } from 'lucide-react';
import { BLOBS, FOOTER, LOGOS, MARQUEE, NAV, POSTS, QUOTES, SERVICES, SPLIT, STATS, VALUES } from './_parts/content';
import { Eyebrow, Icon, Mark, Photo, Words } from './_parts/ui';
import { CarouselNav } from './_parts/CarouselNav';
import { Wordmark } from './_parts/Wordmark';

const HERO = ['hero1', 'hero2', 'hero3'] as const;

export default function Bakawan() {
  return (
    <>
      {/* Gooey alpha threshold: blurred words melt into each other while they reveal. */}
      <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
        <filter id="tw-goo">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </svg>
      <header className="nav">
        <a className="logo" href="#top">
          <Mark /> Bakawan
        </a>
        <nav aria-label="Main" className="nav__links">
          {NAV.map((n) => (
            <a key={n} href="#top">
              {n}
            </a>
          ))}
        </nav>
        <a className="btn btn--outline nav__cta" href="#contact">
          Talk to Us
        </a>
        <button className="nav__menu" popoverTarget="tw-menu" aria-label="Open menu">
          <Menu size={18} strokeWidth={1.6} />
        </button>
        <div id="tw-menu" popover="auto" className="menu">
          {NAV.map((n) => (
            <a key={n} href="#top">
              {n}
            </a>
          ))}
          <a className="btn btn--accent" href="#contact">
            Talk to Us
          </a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero__slides" aria-hidden>
            {HERO.map((h, i) => (
              <div key={h} className="hero__slide" style={{ '--n': i } as React.CSSProperties}>
                <Photo name={h} priority={i === 0} />
              </div>
            ))}
          </div>
          <div className="hero__shade" />
          <div className="hero__body wrap">
            <h1 className="hero__title" data-reveal="words">
              <Words text="Restoring the Mangroves That Protect Us" />
            </h1>
            <div className="hero__side" data-reveal style={{ '--d': '500ms' } as React.CSSProperties}>
              <a className="btn btn--accent" href="#contact">
                Book a Site Survey
              </a>
              <p>
                Nature-based coastal defence for LGUs, ports and island resorts: mangrove, seagrass and reef systems that soften typhoon surges, lock
                away carbon and feed the fishing towns behind them.
              </p>
            </div>
          </div>
          <div className="hero__dots" aria-hidden>
            {HERO.map((h, i) => (
              <span key={h} style={{ '--n': i } as React.CSSProperties} />
            ))}
          </div>
        </section>

        {/* INTRO + BLOB PILE */}
        <section className="intro">
          <div className="marquee" aria-hidden>
            <div className="marquee__track">
              {[0, 1].map((k) => (
                <span key={k}>
                  {MARQUEE.map((m) => (
                    <span key={m}>• {m} </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
          <svg className="ripples" viewBox="0 0 800 800" aria-hidden>
            {[90, 170, 250, 330, 400].map((r) => (
              <circle key={r} cx="400" cy="400" r={r} />
            ))}
            <path d="M0 400 Q200 340 400 400 T800 400" />
            <path d="M0 470 Q200 410 400 470 T800 470" />
            <path d="M0 330 Q200 270 400 330 T800 330" />
          </svg>
          <div className="wrap intro__grid">
            <div data-reveal>
              <Eyebrow>Para sa dagat</Eyebrow>
            </div>
            <p className="intro__lede" data-fill data-reveal="words">
              <Words text="As a trusted coastal restoration partner, we help coastal barangays replace crumbling seawalls with living shorelines that adapt, absorb and regenerate with every monsoon." />
            </p>
          </div>
          <div className="pile" data-reveal="pile" aria-label="Benefits">
            {BLOBS.map((b) => (
              <div
                key={b.label}
                className={`blob blob--${b.shape}`}
                style={{ '--x': `${b.left}px`, '--y': `${b.bottom}px`, '--r': `${b.r}deg`, '--d': `${b.d}ms` } as React.CSSProperties}
              >
                <div className={`blob__body blob--${b.color}`}>
                  <Icon name={b.icon} size={b.shape === 'pill' ? 30 : 44} />
                  <span>{b.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="wrap">
          <div className="stats" data-reveal>
            <Photo name="stats" />
            <div className="stats__inner">
              <Eyebrow light>Impact to date</Eyebrow>
              <div className="stats__grid">
                {STATS.map((s, i) => (
                  <div key={s.label} className="stat" data-reveal style={{ '--d': `${i * 90}ms` } as React.CSSProperties}>
                    <span className="stat__label">
                      <Icon name={s.icon} size={16} />
                      {s.label}
                    </span>
                    <strong data-count={s.to} data-suffix={s.suffix}>
                      {s.to.toLocaleString('en-US')}
                      {s.suffix}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services">
          <div className="wrap section-head">
            <div data-reveal>
              <Eyebrow>What we do</Eyebrow>
            </div>
            <h2 data-reveal="words">
              <Words text="From first survey to lasting stewardship, we design coastlines that pay back in safety, full nets and carbon." />
            </h2>
            <CarouselNav target="tw-services" />
          </div>
          <div className="rail" id="tw-services" tabIndex={0} aria-label="Services">
            {SERVICES.map((s, i) => (
              <article key={s.title} className="card-photo" data-reveal style={{ '--d': `${i * 90}ms` } as React.CSSProperties}>
                <Photo name={s.photo} />
                <div className="card-photo__text">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SPLIT */}
        <section className="wrap split">
          <div className="split__head">
            <div data-reveal>
              <Eyebrow>For LGUs &amp; coastal towns</Eyebrow>
            </div>
            <h2 data-reveal="words">
              <Words text="Resilience built for the islands we call home." />
            </h2>
          </div>
          <div className="split__cards">
            {SPLIT.map((c) => (
              <article key={c.title} className="card-soft" data-reveal>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <a className="btn btn--outline btn--sm" href="#top">
                  {c.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* LOGOS */}
        <section className="logos">
          <p data-reveal>Trusted by the coastal communities leading the change.</p>
          <div className="marquee marquee--logos" aria-label="Partners">
            <div className="marquee__track">
              {[0, 1].map((k) => (
                <span key={k} aria-hidden={k === 1}>
                  {LOGOS.map((l) => (
                    <span key={l.name} className="logo-mark">
                      <Icon name={l.icon} size={18} />
                      {l.name}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="values">
          <Photo name="values" />
          <div className="wrap values__wrap">
            <div className="values__card" data-reveal>
              <Eyebrow light>Our principles</Eyebrow>
              <h2>Restoration isn&apos;t a project we deliver. It&apos;s a pangako we keep with the tide.</h2>
              <div className="accordion">
                {VALUES.map((v, i) => (
                  <details key={v.title} name="tw-values" open={i === 0}>
                    <summary>
                      {v.title}
                      <Plus size={18} strokeWidth={1.6} aria-hidden />
                    </summary>
                    <p>{v.body}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="quotes">
          <div className="wrap section-head">
            <div data-reveal>
              <Eyebrow>Testimonials</Eyebrow>
            </div>
            <h2 data-reveal="words">
              <Words text="Partnering with the fisherfolk who live closest to the water." />
            </h2>
            <CarouselNav target="tw-quotes" />
          </div>
          <div className="rail rail--quotes" id="tw-quotes" tabIndex={0} aria-label="Testimonials">
            {QUOTES.map((q, i) => (
              <figure key={q.name} className="quote" data-reveal style={{ '--d': `${i * 90}ms` } as React.CSSProperties}>
                <blockquote>&ldquo;{q.quote}&rdquo;</blockquote>
                <figcaption>
                  <span className="avatar" aria-hidden>
                    {/* first + last name only, so a quoted nickname doesn't leak into the initials */}
                    {q.name.split(' ')[0][0]}
                    {q.name.split(' ').at(-1)![0]}
                  </span>
                  <span>
                    <strong>{q.name}</strong>
                    <small>
                      {q.role}
                      <br />
                      {q.org}
                    </small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* PURPOSE */}
        <section className="purpose">
          <div className="wrap">
            <div className="purpose__card" data-reveal>
              <Photo name="purpose" />
              <div className="purpose__text">
                <Eyebrow>Our purpose</Eyebrow>
                <h2>Bringing back wild, working coastlines across 7,641 islands.</h2>
                <p>
                  We help fishing towns, investors and LGUs restore the mangroves and reefs that once defended every shore, creating lasting value for people,
                  wildlife and the climate.
                </p>
                <a className="btn btn--accent" href="#top">
                  Discover Our Mission
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* JOURNAL */}
        <section className="journal">
          <div className="wrap section-head">
            <div data-reveal>
              <Eyebrow>Journal &amp; field notes</Eyebrow>
            </div>
            <h2 data-reveal="words">
              <Words text="Ideas shaping the future of Philippine coasts." />
            </h2>
            <div className="section-head__actions">
              <a className="btn btn--outline btn--sm" href="#top">
                See All
              </a>
              <CarouselNav target="tw-journal" />
            </div>
          </div>
          <div className="rail rail--posts" id="tw-journal" tabIndex={0} aria-label="Journal">
            {POSTS.map((p, i) => (
              <article key={p.title} className="post" data-reveal style={{ '--d': `${i * 90}ms` } as React.CSSProperties}>
                <Photo name={p.photo} />
                <span className="post__tag">{p.tag}</span>
                <h3>
                  <a href="#top">
                    {p.title} <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden />
                  </a>
                </h3>
                <time>{p.date}</time>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta" id="contact">
          <Photo name="cta" />
          <div className="cta__body" data-reveal>
            <h2>
              <Words text="Tara, let's build a coastline that fights back." />
            </h2>
            <p>Whether you're facing erosion, storm surge or a net-zero target, our team can scope a restoration programme for your municipality in weeks.</p>
            <a className="btn btn--accent" href="#top">
              Book a Site Survey
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__top">
          <div className="footer__brand">
            <a className="logo logo--light" href="#top">
              <Mark /> Bakawan
            </a>
            <p>Restoring the living edge between lupa and dagat.</p>
          </div>
          <div className="footer__cols">
            {FOOTER.map((c) => (
              <div key={c.head}>
                <h4>{c.head}</h4>
                {c.links.map((l) => (
                  <a key={l} href="#top">
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="wrap footer__bottom">
          <span className="footer__mark" aria-hidden>
            <Mark size={240} />
          </span>
          <div className="footer__right">
            <div className="footer__legal">
              <span>
                <a href="#top">Privacy</a> <a href="#top">Terms</a>
              </span>
              <span>© 2026 Bakawan. A fictional company.</span>
            </div>
            <Wordmark text="Bakawan" />
          </div>
        </div>
      </footer>
    </>
  );
}
