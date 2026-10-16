import { useEffect, useRef, useState } from "react";
import { MarkMail } from "../shared/logos";
import { useReducedMotion, useReveal } from "../shared/hooks";
import { useTheme, type Theme } from "../shared/theme";
import { MAIL_LINKS, MAIL_PAGE } from "../shared/content";
import { Arrow, SecHead } from "../landing/parts";
import "../landing/fonts.css";
import "../landing/cleanroom.css";
// The nav, headline and lede are the Probe page's (cp-*).
import "../probe/probe.css";
import "./mail.css";

export default function MailPage() {
  const root = useReveal<HTMLDivElement>();
  const reduced = useReducedMotion();
  const { theme, toggle } = useTheme(reduced);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return;
      if (e.key === "n" && !e.metaKey && !e.ctrlKey && !e.altKey) toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="cr cr-mail-page" ref={root} data-theme={theme}>
      <a className="cr-skip" href="#mail-main">Skip to content</a>
      <nav className="cr-nav cp-nav" aria-label="Primary">
        <div className="cr-wrap cr-nav__in">
          <a className="cr-logo cr-logo--mail" href={MAIL_LINKS.home} aria-label="Vora Mail home"><MarkMail size={28} /><span>Vora Mail</span></a>
          <div className="cp-nav__links">
            <a href="#features">Features</a>
            <a href="#data">Your data</a>
            <a href="#faq">FAQ</a>
            <a href={MAIL_LINKS.privacy}>Privacy</a>
          </div>
          <div className="cr-nav__right">
            <button type="button" className={`cr-lights ${theme === "night" ? "is-night" : ""}`}
              aria-pressed={theme === "night"}
              aria-label={theme === "night" ? "Switch to day mode (n)" : "Switch to night mode (n)"}
              onClick={(e) => {
                const b = e.currentTarget.getBoundingClientRect();
                toggle({ x: b.left + b.width / 2, y: b.top + b.height / 2 });
              }}>
              <span className="cr-lights__track" aria-hidden="true"><span className="cr-lights__knob">
                <svg viewBox="0 0 24 24" className="cr-lights__sun"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" /></svg>
                <svg viewBox="0 0 24 24" className="cr-lights__moon"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>
              </span></span>
              <span className="cr-lights__label">{theme === "night" ? "Night" : "Day"}</span>
            </button>
            <a className="cr-btn cr-btn--primary cr-btn--sm" href={MAIL_LINKS.source}>Source <Arrow /></a>
          </div>
        </div>
      </nav>

      <main id="mail-main">
        <header className="cm-hero" id="top">
          <div className="cr-wrap cm-hero__grid">
            <div className="cm-hero__copy">
              <p className="cm-status">{MAIL_PAGE.status.map((s) => <span key={s}>{s}</span>)}</p>
              <h1 className="cp-h1 cm-h1">{MAIL_PAGE.headline[0]}<br /><em>{MAIL_PAGE.headline[1]}</em></h1>
              <p className="cp-lede">{MAIL_PAGE.intro}</p>
              <div className="cr-ctas">
                <a className="cr-btn cr-btn--primary" href="#data">How it handles your data <Arrow /></a>
                <a className="cr-btn cr-btn--glass" href={`${MAIL_LINKS.contact}?subject=Vora%20Mail%20beta`}>Ask about the beta</a>
              </div>
              <p className="cr-fine">{MAIL_PAGE.traits.map((t) => <span key={t}>{t}</span>)}</p>
            </div>
            <HeroVideo theme={theme} reduced={reduced} />
          </div>
        </header>

        <section className="cm-guarantees" aria-label="Guarantees">
          <ul className="cr-wrap cm-guarantees__list">
            {MAIL_PAGE.guarantees.map((g) => <li key={g.title} data-reveal>
              <Glyph kind={g.glyph} />
              <div><h2>{g.title}</h2><p>{g.text}</p></div>
            </li>)}
          </ul>
        </section>

        <section className="cr-sec cm-features" id="features" aria-labelledby="cm-features-title">
          <div className="cr-wrap">
            <SecHead n="01" label="What it does today" title={<span id="cm-features-title">A mail client that <span className="cr-soft">stays out of the way.</span></span>} />
            <div className="cm-features__list">
              {MAIL_PAGE.features.map((f, i) => <article className={`cm-feature ${i % 2 ? "cm-feature--flip" : ""}`} key={f.id} data-reveal>
                <div className="cm-feature__copy">
                  <p className="cm-feature__label"><span>0{i + 1}</span>{f.label}</p>
                  <h3>{f.title[0]}<br /><span className="cr-soft">{f.title[1]}</span></h3>
                  <p className="cm-feature__text">{f.text}</p>
                  {"points" in f && f.points && <ul className="cm-feature__points">{f.points.map((p) => <li key={p}>{p}</li>)}</ul>}
                </div>
                <FeatureVisual id={f.id} theme={theme} />
              </article>)}
            </div>
          </div>
        </section>

        <section className="cr-sec cm-data" id="data" aria-labelledby="cm-data-title">
          <div className="cr-wrap">
            <SecHead n="02" label="What leaves your computer" title={<span id="cm-data-title">Your mail goes to your provider. <span className="cr-soft">Nothing comes to us.</span></span>}
              sub={MAIL_PAGE.data.intro} />
            <div className="cm-data__grid">
              <div className="cm-table" role="table" aria-label="Every place Vora Mail connects to" data-reveal>
                <div className="cm-table__head" role="row"><span role="columnheader">Goes to</span><span role="columnheader">When</span></div>
                {MAIL_PAGE.data.rows.map((r) => <div className={`cm-table__row ${r.to === "Us" ? "cm-table__row--never" : ""}`} role="row" key={r.to}>
                  <span role="cell"><b>{r.to}</b><small>{r.detail}</small></span>
                  <span role="cell">{r.when}</span>
                </div>)}
              </div>
              <aside className="cm-data__aside" data-reveal>
                <div className="cm-gmail">
                  <p className="cm-gmail__tag">GMAIL · AI</p>
                  <h3>{MAIL_PAGE.data.gmail.title}</h3>
                  <p>{MAIL_PAGE.data.gmail.text}</p>
                </div>
                <p className="cm-data__ai">{MAIL_PAGE.data.ai}</p>
                <p className="cm-limited">{MAIL_PAGE.data.limitedUse[0]}<a href={MAIL_LINKS.googlePolicy}>{MAIL_PAGE.data.limitedUse[1]}</a>{MAIL_PAGE.data.limitedUse[2]}</p>
                <a className="cr-btn cr-btn--primary" href={MAIL_LINKS.privacy}>Read the privacy policy <Arrow /></a>
              </aside>
            </div>
          </div>
        </section>

        <section className="cr-sec cm-faq" id="faq" aria-labelledby="cm-faq-title">
          <div className="cr-wrap cm-faq__grid">
            <div data-reveal>
              <p className="cp-overline">STATUS / BETA 0.2.0-beta.1</p>
              <h2 className="cr-h2" id="cm-faq-title">An honest beta. <span className="cr-soft">Questions, answered.</span></h2>
              <p className="cr-sub">Write to <a className="cr-tlink" href={MAIL_LINKS.contact}>{MAIL_LINKS.contactAddress}</a> for anything else.</p>
            </div>
            <Faq />
          </div>
        </section>
      </main>

      <footer className="cr-foot"><div className="cr-wrap cr-foot__in">
        <a className="cr-logo cr-logo--mail" href={MAIL_LINKS.home} aria-label="Vora Mail home"><MarkMail size={22} /><span>Vora Mail</span></a>
        <nav className="cr-foot__links" aria-label="Footer">
          <a href={MAIL_LINKS.source}>Source on GitHub</a>
          <a href={MAIL_LINKS.privacy}>Privacy policy</a><a href={MAIL_LINKS.legal}>Legal notice</a>
          <a href={MAIL_LINKS.contact}>{MAIL_LINKS.contactAddress}</a>
        </nav>
        <p className="cr-foot__legal">MIT or Apache-2.0 · © {new Date().getFullYear()} Vora Mail</p>
      </div></footer>
    </div>
  );
}

const VIDEO_BASE = "/mail/vora-mail-hero-";

function HeroVideo({ theme, reduced }: { theme: Theme; reduced: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  // Under reduced motion the poster stays until the visitor presses play.
  const [playing, setPlaying] = useState(!reduced);
  const file = `${VIDEO_BASE}${theme === "night" ? "dark" : "light"}`;

  useEffect(() => setPlaying(!reduced), [reduced]);


  const toggle = () => {
    const v = video.current;
    if (!v) return setPlaying(true);
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return <figure className="cm-window">
    <div className="cm-window__frame">
      {/* Keyed on the theme so the element reloads its sources when the theme flips. */}
      <video key={theme} ref={video} className="cm-window__media" autoPlay={playing} muted loop playsInline preload="metadata"
        poster={`${file}-poster.webp`} aria-describedby="cm-video-alt" width={1600} height={1000}>
        <source src={`${file}.av1.webm`} type='video/webm; codecs="av01.0.08M.08"' />
        <source src={`${file}.webm`} type='video/webm; codecs="vp9"' />
        <source src={`${file}.mp4`} type='video/mp4; codecs="avc1.640032"' />
      </video>
      <button type="button" className={`cm-play ${playing ? "is-playing" : ""}`} onClick={toggle}
        aria-label={playing ? "Pause the video" : "Play the video"}>
        {playing
          ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z" /></svg>
          : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" /></svg>}
      </button>
    </div>
    <figcaption className="cr-sr" id="cm-video-alt">{MAIL_PAGE.video.alt}</figcaption>
  </figure>;
}

function FeatureVisual({ id, theme }: { id: string; theme: Theme }) {
  const still = theme === "night" ? "dark" : "light";
  if (id === "accounts") return <div className="cm-vis cm-vis--still">
    <img src={`/mail/${still}-all-inboxes.webp`} alt={MAIL_PAGE.stills.allInboxes} loading="lazy" width={1600} height={1000} />
  </div>;
  if (id === "smart-inbox") return <div className="cm-vis cm-vis--tabs" aria-hidden="true">
    {MAIL_PAGE.features[1].tabs!.map((t, i) => <span key={t} className={i === 0 ? "is-on" : ""}><kbd>{i + 1}</kbd>{t}</span>)}
    <p>Local rules · no AI</p>
  </div>;
  if (id === "search") return <div className="cm-vis cm-vis--still">
    <img src={`/mail/${still}-search.webp`} alt={MAIL_PAGE.stills.search} loading="lazy" width={1600} height={1000} />
  </div>;
  if (id === "writing") return <div className="cm-vis cm-vis--still">
    <img src={`/mail/${still}-write.webp`} alt={MAIL_PAGE.stills.write} loading="lazy" width={1600} height={1000} />
  </div>;
  return <div className="cm-vis cm-vis--desktop cm-vis--still" aria-hidden="true">
    <img src={`/mail/${still}-palette.webp`} alt="" loading="lazy" width={1600} height={1000} />
    <div className="cm-vis__keys">{MAIL_PAGE.shortcuts.map((s) => <div key={s.label}>{s.keys.map((k) => <kbd key={k}>{k}</kbd>)}<span>{s.label}</span></div>)}</div>
  </div>;
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="cr-faq" data-reveal>
    {MAIL_PAGE.faq.map((f, i) => {
      const isOpen = open === i;
      return <div key={f.q} className={`cr-faq__item ${isOpen ? "is-open" : ""}`}>
        <h3><button type="button" id={`cm-faq-q${i}`} aria-expanded={isOpen} aria-controls={`cm-faq-a${i}`} onClick={() => setOpen(isOpen ? null : i)}>
          <span>{f.q}</span><span className="cr-disclose__sign" aria-hidden="true" />
        </button></h3>
        <div className="cr-faq__a" id={`cm-faq-a${i}`} role="region" aria-labelledby={`cm-faq-q${i}`} hidden={!isOpen}><p>{f.a}</p></div>
      </div>;
    })}
  </div>;
}

function Glyph({ kind }: { kind: string }) {
  const common = { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  return <svg className="cm-glyph" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><g {...common}>
    {kind === "server" && <><rect x="4" y="4" width="16" height="6" rx="1.5" /><rect x="4" y="14" width="16" height="6" rx="1.5" /><path d="M3 21 21 3" /></>}
    {kind === "lock" && <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3M12 14.5v2.5" /></>}
    {kind === "keys" && <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8" /></>}
  </g></svg>;
}
