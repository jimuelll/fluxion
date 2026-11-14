import {
  ArrowRight, BatteryFull, Check, ChevronLeft, Lock, Mail, Menu, MessageCircle, Palette, Plus, Search, Send, Sheet,
  ShoppingBag, Signal, Video, Wallet, Wifi,
} from 'lucide-react';
import {
  COMMANDS, CREW, FOOT, INTRO, MEMORY, NAV, NENA_CHAT, NOTIFS, QUOTES, SCATTER, SCATTER_MOBILE, TEMPLATES, TERMINAL, TOOLS, face,
} from './_parts/content';

type CSS = React.CSSProperties & Record<`--${string}`, string | number>;

const ICON = { Messenger: MessageCircle, GCash: Wallet, Shopee: ShoppingBag, Sheets: Sheet, Canva: Palette, Gmail: Mail };

const Btn = ({ children, big = false }: { children: React.ReactNode; big?: boolean }) => (
  <a href="#start" className={`btn ${big ? 'btn--big' : ''}`}>
    {children}
  </a>
);

const More = ({ children }: { children: React.ReactNode }) => (
  <a href="#start" className="more">
    {children} <ArrowRight size={14} strokeWidth={2.2} />
  </a>
);

const Avatar = ({ n, size = 40, className = '' }: { n: string; size?: number; className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={face(n)} alt="" width={size} height={size} className={`av ${className}`} />
);

// Each word carries its share of the sentence; CSS lights it from the scene's progress.
const Words = ({ text }: { text: string }) => {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="wd" style={{ '--w': i / words.length } as CSS}>
          {w}{' '}
        </span>
      ))}
    </>
  );
};

const StatusBar = ({ light = false }: { light?: boolean }) => (
  <div className={`status ${light ? 'status--light' : ''}`}>
    <span>9:41</span>
    <i className="island" />
    <span className="status__icons">
      <Signal size={13} />
      <Wifi size={13} />
      <BatteryFull size={15} />
    </span>
  </div>
);

export default function Tropa() {
  return (
    <>
      <header className="nav">
        <a href="#top" className="logo" aria-label="Tropa home">
          <span className="logo__mark" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          tropa
        </a>
        <nav aria-label="Main" className="nav__pill">
          {NAV.map((n) => (
            <a key={n} href="#start">
              {n}
            </a>
          ))}
        </nav>
        <div className="nav__right">
          <a href="#start" className="nav__login">
            Log in
          </a>
          <Btn>Hire your first crew</Btn>
        </div>
        <button className="nav__menu" popoverTarget="tr-menu" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div id="tr-menu" popover="auto" className="menu">
          {NAV.map((n) => (
            <a key={n} href="#start">
              {n}
            </a>
          ))}
          <Btn>Hire your first crew</Btn>
        </div>
      </header>

      <main id="top">
        {/* HERO: a ring of crew that scatters into the intro as you scroll (Skydive's opening, with a lede that says what it is). */}
        <section className="scene hero" data-scene data-steps="1">
          <div className="stage hero__stage">
            <div className="ring" aria-hidden>
              {CREW.map((n, i) => {
                const a = (i / CREW.length) * Math.PI * 2 - Math.PI / 2;
                const [sx, sy, sz] = SCATTER[i];
                const [mx, my, mz] = SCATTER_MOBILE[i];
                return (
                  <span
                    key={n}
                    className="tile"
                    style={{ '--a': `${a.toFixed(4)}rad`, '--dx': sx, '--dy': sy, '--dz': sz, '--mx': mx, '--my': my, '--mz': mz, '--mo': Math.abs(my) < 10 ? 0 : Math.sign(my), '--i': i } as CSS}
                  >
                    <img src={face(n)} alt="" />
                  </span>
                );
              })}
            </div>
            <div className="hero__copy">
              <h1>
                Hire a tropa that
                <br />
                never clocks out
              </h1>
              <Btn big>
                Hire your first crew<span className="hide-sm"> member</span>
              </Btn>
              <span className="hero__chat">
                Chat on <MessageCircle size={17} /> <Send size={17} /> <Mail size={17} />
              </span>
            </div>
            <p className="hero__intro">
              <Words text={INTRO} />
            </p>
            {/* Bottom-right on desktop; on phones both rows stack at the bottom, as on Skydive. */}
            <div className="hero__with" aria-label="Channels and apps">
              <span className="hero__with-chat">
                Chat on <MessageCircle size={16} /> <Send size={16} /> <Mail size={16} />
              </span>
              <span>
                Works with <Wallet size={18} /> <ShoppingBag size={18} /> <Sheet size={18} /> <Palette size={18} /> <b>+400 more</b>
              </span>
            </div>
          </div>
        </section>

        {/* CHANNELS + ROUTINES: one pinned phone, four screens. */}
        <section className="scene feat" data-scene data-steps="6" id="product">
          <div className="stage feat__stage">
            <div className="feat__copy">
              <div className="copy" data-at="0-2">
                <h3>Same crew on every chat app</h3>
                <ul className="chips">
                  <li data-at="0">
                    <MessageCircle size={13} /> Messenger
                  </li>
                  <li data-at="1">
                    <Send size={13} /> Viber
                  </li>
                  <li data-at="2">
                    <Mail size={13} /> Gmail
                  </li>
                </ul>
                <p>Customers message on Messenger, you check in on Viber, the bulk orders come by email. One identity, one memory, wherever the chika happens.</p>
                <More>See channels</More>
              </div>
              <div className="copy" data-at="3-5">
                <h3>
                  Routines that run
                  <br />
                  while you sleep
                </h3>
                <p>Turn the daily grind into routines. Your crew counts stock, matches payments and preps the morning summary, long after the shop’s shutters are down.</p>
                <More>Explore routines</More>
              </div>
            </div>

            <div className="phone">
              <div className="screen scr-msg" data-at="0">
                <StatusBar />
                <div className="msg__head">
                  <ChevronLeft size={20} />
                  <span className="msg__who">
                    <Avatar n="nena" size={34} />
                    <b>Lechon ni Mang Ben</b>
                    <small>Replies instantly · Nena</small>
                  </span>
                  <Video size={18} />
                </div>
                <div className="thread">
                  {NENA_CHAT.map((m, i) => (
                    <p key={i} className={`bub ${m.me ? 'bub--me' : ''}`} style={{ '--d': i } as CSS}>
                      {m.text}
                    </p>
                  ))}
                </div>
              </div>

              <div className="screen scr-viber" data-at="1">
                <StatusBar />
                <div className="msg__head msg__head--group">
                  <ChevronLeft size={20} />
                  <span>
                    <b>Owners 🐷</b>
                    <small>3 members · Nena, Jun, you</small>
                  </span>
                  <Search size={18} />
                </div>
                <div className="post" style={{ '--d': 0 } as CSS}>
                  <Avatar n="nena" size={30} />
                  <div>
                    <b>
                      Nena <em>crew</em> <small>6:02 AM</small>
                    </b>
                    <p>Morning boss! 42 orders for Sunday, 38 paid. I’ll remind the 4 unpaid at 6PM.</p>
                    <span className="reacts">
                      <span>👍 2</span>
                      <span>🙌 1</span>
                    </span>
                  </div>
                </div>
                <div className="post" style={{ '--d': 1 } as CSS}>
                  <Avatar n="bong" size={30} />
                  <div>
                    <b>
                      Ben <small>6:10 AM</small>
                    </b>
                    <p>Ayos. Tell Jun to add 2 more pigs for Saturday.</p>
                  </div>
                </div>
                <div className="post" style={{ '--d': 2 } as CSS}>
                  <Avatar n="jun" size={30} />
                  <div>
                    <b>
                      Jun <em>crew</em> <small>6:10 AM</small>
                    </b>
                    <p>Done. Supplier confirmed, delivery Friday 4PM.</p>
                  </div>
                </div>
              </div>

              <div className="screen scr-mail" data-at="2">
                <StatusBar />
                <div className="mail__bar">
                  <ChevronLeft size={18} /> Inbox
                </div>
                <div className="mail" style={{ '--d': 0 } as CSS}>
                  <Avatar n="nena" size={38} />
                  <div>
                    <b>
                      Nena <small>9:02 AM</small>
                    </b>
                    <span>To: You</span>
                  </div>
                </div>
                <div className="mail__body" style={{ '--d': 1 } as CSS}>
                  <h4>Bulk order: company Christmas party, 80 pax</h4>
                  <p>Drafted a quote for Ms. Santos: 2 whole lechon, 80 rice, delivery 11AM on Dec 19. Total ₱24,600.</p>
                  <p>Waiting on your OK before I send it.</p>
                  <span className="attach">
                    <b>PDF</b> quote-santos-80pax.pdf
                  </span>
                </div>
              </div>

              <div className="screen scr-lock" data-at="3-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/tropa/dusk.webp" alt="" className="lock__bg" />
                <StatusBar light />
                <div className="lock__time">
                  <small>Sunday, December 14</small>
                  <b>6:00</b>
                </div>
                <div className="notifs">
                  {NOTIFS.map(([n, who, ago, t, d], i) => (
                    <div key={who} className="notif" data-at={String(3 + i)}>
                      <Avatar n={n} size={34} />
                      <div>
                        <b>{who}</b>
                        <span>{t}</span>
                        <small>{d}</small>
                      </div>
                      <time>{ago}</time>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPUTER + MEMORY */}
        <section className="scene feat feat--desk" data-scene data-steps="4">
          <div className="stage feat__stage">
            <div className="feat__copy">
              <div className="copy" data-at="0-1">
                <h3>Every crew member has their own computer</h3>
                <p>They open spreadsheets, browse supplier sites, write reports and file things away, start to finish, without you hovering.</p>
                <More>Learn more</More>
              </div>
              <div className="copy" data-at="2-3">
                <h3>Crew that learns the way your shop works</h3>
                <p>Correct them once and it sticks. Every rule, suki and preference carries into the next shift.</p>
                <More>Explore self-improvement</More>
              </div>
            </div>

            <div className="desk">
              <div className="win chat">
                <div className="chat__head">
                  <Avatar n="bea" size={30} />
                  <span>
                    <b>Bea</b>
                    <small>Bookkeeper</small>
                  </span>
                </div>
                <p className="chat__ask">Pa-check ng GCash kahapon vs orders? Short lang ang report, Taglish.</p>
                <span className="typing" data-at="0-1">
                  <i />
                  <i />
                  <i />
                </span>
                <p className="chat__reply" data-at="2">
                  Done po. 61 of 63 matched, 2 flagged for you. Noted din: reports in Taglish, short lang. Tatandaan ko ’yan.
                </p>
              </div>
              <div className="win term" data-at="1">
                <div className="win__bar">
                  <i />
                  <i />
                  <i />
                  <span>bea — ~/bayad</span>
                </div>
                <pre>
                  {TERMINAL.map(([kind, line], i) => (
                    <span key={i} className={`tl tl--${kind}`} style={{ '--d': i } as CSS}>
                      {kind === 'cmd' ? 'bea:~/bayad $ ' : kind === 'ok' ? '  ✓ ' : kind === 'warn' ? '  ! ' : '  '}
                      {line}
                      {'\n'}
                    </span>
                  ))}
                  <span className="caret" />
                </pre>
              </div>
              <div className="win mem" data-at="2">
                <div className="win__bar">
                  <i />
                  <i />
                  <i />
                  <span>Bea’s memory</span>
                </div>
                <ul>
                  {MEMORY.map(([m, fresh], i) => (
                    <li key={m} className={fresh ? 'fresh' : ''} style={{ '--d': i } as CSS}>
                      <Check size={14} strokeWidth={2.4} />
                      {m}
                      {fresh && <em>New</em>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* TOOLS → TEAM: orbit fills one app at a time, then turns into the crew ring. */}
        <section className="scene orbit-scene" data-scene data-steps="10" id="integrations">
          <div className="stage orbit__stage">
            <div className="orbit__copy">
              <div className="copy copy--center" data-at="0-6">
                <h2>Real work, in the apps you already use</h2>
                <p>Messenger, GCash, Shopee, Google Sheets, Canva, Gmail and 400 more. Your crew works inside them, and asks first before anything leaves the shop.</p>
                <More>Explore integrations</More>
              </div>
              <div className="copy copy--center" data-at="7-9">
                <h2>Crew that works as a team</h2>
                <p>Nena takes the order, Bea checks the payment, Jun pulls it from stock. They share context so bigger jobs get done, like a real barkada.</p>
                <More>Explore collaboration</More>
              </div>
            </div>

            <div className="orbit">
              <span className="orbit__track" />
              <div className="orbit__core">
                <Avatar n="nena" size={96} className="core__nena" />
                <span className="core__mark logo__mark" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              {TOOLS.map((t, i) => {
                const I = ICON[t];
                return (
                  <span key={t} className="badge" data-at={`${i}-6`} style={{ '--a': `${i * 45 - 90}deg` } as CSS} title={t}>
                    <I size={20} />
                  </span>
                );
              })}
              <span className="badge badge--more" data-at="6" style={{ '--a': '180deg' } as CSS}>
                +400
              </span>
              <span className="badge badge--more" data-at="6" style={{ '--a': '-135deg' } as CSS}>
                <Search size={18} />
              </span>

              <div className="team" data-at="7-9">
                {CREW.slice(0, 8).map((n, i) => (
                  <span key={n} className="team__m" style={{ '--a': `${i * 45}deg` } as CSS}>
                    <Avatar n={n} size={58} />
                  </span>
                ))}
              </div>
              <div className="cmds">
                {COMMANDS.map(([n, c, t], i) => (
                  <span key={c} className="cmd" data-at={String(7 + i)}>
                    <Avatar n={n} size={22} />
                    {c}
                    <time>{t}</time>
                  </span>
                ))}
              </div>
            </div>

            <div className="cards">
              <article className="tcard" data-at="0">
                <header>
                  <MessageCircle size={14} /> Messenger
                </header>
                <h4>Order #2291 confirmed</h4>
                <p>1/4 lechon · Sunday 11AM · Banilad delivery</p>
                <span className="pill-ok">
                  <Check size={12} /> Paid via GCash
                </span>
                <footer>
                  <Avatar n="nena" size={18} /> Replied by Nena · just now
                </footer>
              </article>
              <article className="tcard" data-at="1">
                <header>
                  <Wallet size={14} /> GCash
                </header>
                <h4 className="big">₱2,970.00</h4>
                <p>Received from R. Dela Cruz · Ref 7012 448 391</p>
                <footer>
                  <Avatar n="bea" size={18} /> Matched to order #2291 by Bea
                </footer>
              </article>
              <article className="tcard" data-at="2">
                <header>
                  <ShoppingBag size={14} /> Shopee
                </header>
                <h4>14 orders ready to ship</h4>
                <ul className="rows">
                  <li>
                    Waybills printed <b>14/14</b>
                  </li>
                  <li>
                    J&amp;T pickup <b>3:00 PM</b>
                  </li>
                  <li>
                    Chats answered <b>52</b>
                  </li>
                </ul>
                <footer>
                  <Avatar n="kiko" size={18} /> Handled by Kiko · just now
                </footer>
              </article>
              <article className="tcard" data-at="3">
                <header>
                  <Sheet size={14} /> Google Sheets
                </header>
                <h4>Inventory · Week 50</h4>
                <ul className="rows rows--sheet">
                  <li>
                    Rice 25kg <b className="low">3 left</b>
                  </li>
                  <li>
                    Eggs (tray) <b className="low">6 left</b>
                  </li>
                  <li>
                    Coke 1.5L <b>18 left</b>
                  </li>
                  <li>
                    Lucky Me pancit canton <b>64 left</b>
                  </li>
                </ul>
                <footer>
                  <Avatar n="jun" size={18} /> Updated by Jun · just now
                </footer>
              </article>
              <article className="tcard" data-at="4">
                <header>
                  <Palette size={14} /> Canva
                </header>
                <div className="frames">
                  <span>
                    12.12
                    <small>SALE</small>
                  </span>
                  <span>
                    12.12
                    <small>Story</small>
                  </span>
                  <span>
                    12.12
                    <small>Banner</small>
                  </span>
                </div>
                <footer>
                  <Avatar n="migs" size={18} /> Designed by Migs · 3 frames
                </footer>
              </article>
              <article className="tcard" data-at="5">
                <header>
                  <Mail size={14} /> Gmail
                </header>
                <h4>Re: Bulk order, 80 pax</h4>
                <p>Hi Ms. Santos! Yes to all three: 2 whole lechon, 80 rice, delivery by 11AM. Quote attached po.</p>
                <span className="fake-btn">Send</span>
                <footer>
                  <Avatar n="nena" size={18} /> Drafted by Nena · waiting on you
                </footer>
              </article>
            </div>
          </div>
        </section>

        {/* TEMPLATES: Skydive's grid, with a photo of the shop each one is for. */}
        <section className="tpl" id="templates">
          <div className="tpl__head" data-reveal>
            <div>
              <h2>Start from a template</h2>
              <p>Pre-trained crew for the negosyo we see most. Pick one, give them a name, tweak the rules in plain Taglish.</p>
            </div>
            <a href="#start" className="more more--box">
              Browse all templates <ArrowRight size={14} />
            </a>
          </div>
          <ul className="tpl__grid">
            {TEMPLATES.map(([img, n, name, line, tools], i) => (
              <li key={name} data-reveal style={{ '--i': i % 3 } as CSS}>
                <a href="#start">
                  <span className="tpl__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/tropa/${img}.webp`} alt="" loading="lazy" />
                    <Avatar n={n} size={44} className="tpl__av" />
                  </span>
                  <span className="tpl__body">
                    <b>{name}</b>
                    <span>{line}</span>
                    <span className="tpl__tools">
                      {tools.map((t) => {
                        const I = ICON[t];
                        return <I key={t} size={15} aria-label={t} />;
                      })}
                    </span>
                  </span>
                  <Plus className="tpl__plus" size={18} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* STORIES */}
        <section className="stories" id="stories">
          <h2 data-reveal>Mga may-ari, nagsalita na</h2>
          <figure className="feature">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tropa/owner.webp" alt="Ben Abellana, seated in his shop" loading="lazy" />
            <blockquote data-fill>
              <Words text="“December used to mean my daughter answering Messenger until 2AM. Now Nena does, and she has never once mixed up an order. We’re pointing the crew at the whole commissary next.”" />
            </blockquote>
            <figcaption>
              <b>Ben Abellana</b> Owner, Lechon ni Mang Ben · Cebu
              <span>
                who made <Avatar n="nena" size={24} /> Nena to run pre-orders in <MessageCircle size={16} /> Messenger
              </span>
            </figcaption>
          </figure>
          <div className="qm" aria-label="More stories">
            <div className="qm__track">
              {[0, 1].map((k) =>
                QUOTES.map(([n, who, biz, q]) => (
                  <blockquote key={`${k}${who}`} className="qcard" aria-hidden={k === 1}>
                    <span className="qcard__who">
                      <Avatar n={n} size={40} />
                      <span>
                        <b>{who}</b>
                        <small>{biz}</small>
                      </span>
                    </span>
                    <p>{q}</p>
                  </blockquote>
                )),
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta" id="start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tropa/sunrise.webp" alt="" className="cta__bg" loading="lazy" />
          <div className="cta__copy" data-reveal>
            <h2>Tara na</h2>
            <Btn big>
              Hire your first crew member <ArrowRight size={18} />
            </Btn>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="foot__top">
          <span className="logo__mark logo__mark--big" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <div className="foot__cols">
            {FOOT.map(([h, links]) => (
              <div key={h}>
                <h3>{h}</h3>
                {links.map((l) => (
                  <a key={l} href="#top">
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="foot__word" aria-hidden>
          tropa
        </p>
        <div className="foot__base">
          <span>© 2026 Tropa · a fictional Fluxion style</span>
          <span>
            <Lock size={12} /> Privacy · Terms
          </span>
        </div>
      </footer>
    </>
  );
}
