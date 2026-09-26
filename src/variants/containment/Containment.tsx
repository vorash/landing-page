import { useEffect, useRef, useState } from "react";
import { MarkCell } from "../../shared/logos";
import { useCopy, useFonts, useReducedMotion, useReveal } from "../../shared/hooks";
import { AGENT_PROMPT, LINKS, STATUS } from "../../shared/content";
import { Chamber } from "./Chamber";
import { Layers } from "./Layers";
import { Clone, Custody, Measures, Protocol } from "./Sections";
import { Clearance, Datasheet, Probe, SafetySheet } from "./Sheets";
import { Barcode, GitHubIcon, Jump } from "./ui";
import "./containment.css";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Big+Shoulders:opsz,wght@10..72,100..900&family=IBM+Plex+Sans+Condensed:wght@400;500;600&family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap";

const TAPE = [
  "Assume malicious",
  "Default deny",
  "Nothing leaves unrecorded",
  "No KVM required",
  "No Kubernetes in the path",
  "Secretless credentials",
  "Budgets, not hopes",
  "Snapshot · fork · destroy",
];

const NAV = [
  { to: "chamber", label: "Chamber" },
  { to: "layers", label: "Layers" },
  { to: "protocol", label: "Protocol" },
  { to: "datasheet", label: "Datasheet" },
  { to: "probe", label: "Probe" },
];

export default function Containment() {
  useFonts(FONTS);
  const reduced = useReducedMotion();
  const root = useReveal<HTMLDivElement>();

  useEffect(() => {
    document.title = "Vora — Contain it. Watch it. Prove it.";
  }, []);

  return (
    <div className="cp" ref={root}>
      <a className="cp-skip" href="#cp-main" onClick={(e) => {
        e.preventDefault();
        document.getElementById("cp-main")?.focus();
      }}>
        Skip to content
      </a>
      <Tape />
      <Nav />
      <main id="cp-main" tabIndex={-1}>
        <Hero reduced={reduced} />
        <Paranoia />
        <Layers />
        <Protocol />
        <Measures />
        <Custody reduced={reduced} />
        <Clone />
        <Datasheet />
        <Probe />
        <SafetySheet />
        <Clearance />
      </main>
      <Footer />
    </div>
  );
}

function Tape() {
  const items = (hidden: boolean) =>
    TAPE.map((t) => (
      <span key={`${t}${hidden}`} className="cp-tape__item">
        <b aria-hidden="true">{"\u26A0\uFE0E"}</b> {t}
      </span>
    ));
  return (
    <div className="cp-tape" aria-hidden="true">
      <div className="cp-tape__track">
        <div className="cp-tape__set">{items(false)}</div>
        <div className="cp-tape__set">{items(true)}</div>
      </div>
    </div>
  );
}

function Nav() {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const on = () => setStuck(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={`cp-nav ${stuck ? "is-stuck" : ""}`} aria-label="Primary">
      <div className="cp-nav__in">
        <Jump to="top" className="cp-brand" label="Vora — back to top">
          <MarkCell size={28} />
          <span className="cp-brand__word">Vora</span>
          <span className="cp-brand__sub">/ containment runtime</span>
        </Jump>
        <ul className="cp-nav__links">
          {NAV.map((n, i) => (
            <li key={n.to}>
              <Jump to={n.to}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {n.label}
              </Jump>
            </li>
          ))}
        </ul>
        <span className="cp-nav__status" aria-hidden="true">
          <i /> All chambers sealed
        </span>
        <a className="cp-nav__gh" href={LINKS.github}>
          <GitHubIcon />
          <span>GitHub</span>
          <b>{STATUS.version}</b>
        </a>
      </div>
    </nav>
  );
}

function Hero({ reduced }: { reduced: boolean }) {
  const { copied, copy } = useCopy();
  const xh = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLElement>(null);

  // A registration crosshair that tracks the pointer across the hero (fine pointers only).
  useEffect(() => {
    const el = host.current;
    const aim = xh.current;
    if (!el || !aim || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const read = aim.querySelector<HTMLElement>(".cp-xh__read");
    let raf = 0;
    let x = 0;
    let y = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        aim.style.setProperty("--mx", `${x}px`);
        aim.style.setProperty("--my", `${y}px`);
        if (read) read.textContent = `X ${String(Math.round(x)).padStart(4, "0")} · Y ${String(Math.round(y)).padStart(4, "0")}`;
      });
    };
    const enter = () => aim.classList.add("is-on");
    const leave = () => aim.classList.remove("is-on");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [reduced]);

  return (
    <section className="cp-hero" id="top" tabIndex={-1} ref={host} aria-labelledby="cp-h1">
      <div className="cp-xh" ref={xh} aria-hidden="true">
        <span className="cp-xh__h" />
        <span className="cp-xh__v" />
        <span className="cp-xh__read">X 0000 · Y 0000</span>
      </div>
      <svg className="cp-porthole" viewBox="0 0 600 600" aria-hidden="true">
        <circle cx="300" cy="300" r="290" />
        <circle cx="300" cy="300" r="250" strokeDasharray="2 10" />
        <circle cx="300" cy="300" r="210" />
        <g className="cp-porthole__ticks">
          {Array.from({ length: 72 }).map((_, i) => (
            <path key={i} d={`M300 ${i % 6 === 0 ? 4 : 12}V24`} transform={`rotate(${i * 5} 300 300)`} />
          ))}
        </g>
        <path d="M300 60V540M60 300H540" strokeDasharray="1 7" />
      </svg>

      <div className="cp-wrap cp-hero__grid">
        <div className="cp-hero__copy">
          <p className="cp-eyebrow">
            <span className="cp-eyebrow__haz" aria-hidden="true" />
            Containment protocol VR-07 · Assume malicious
          </p>
          <h1 className="cp-h1" id="cp-h1">
            <span className="cp-h1__row">
              <i aria-hidden="true">01</i>
              <span className="cp-h1__w">Contain it.</span>
              <em aria-hidden="true">isolate · bwrap / gVisor</em>
            </span>
            <span className="cp-h1__row cp-h1__row--hatch">
              <i aria-hidden="true">02</i>
              <span className="cp-h1__w">Watch it.</span>
              <em aria-hidden="true">observe · flight recorder</em>
            </span>
            <span className="cp-h1__row cp-h1__row--lime">
              <i aria-hidden="true">03</i>
              <span className="cp-h1__w">Prove it.</span>
              <em aria-hidden="true">verify · chain of custody</em>
            </span>
          </h1>
          <p className="cp-lede">
            Vora is an open-source runtime that seals AI agents, generated scripts and untrusted PRs inside isolated Linux
            sandboxes — default-deny network, credentials they never see, and a chain of custody for every exec and every
            packet. <strong>One Go binary. No Kubernetes.</strong>
          </p>
          <div className="cp-ctas">
            <Jump to="clearance" className="cp-btn cp-btn--primary">
              Request clearance <span aria-hidden="true">→</span>
            </Jump>
            <button className="cp-btn cp-btn--ghost" onClick={() => copy(AGENT_PROMPT, "prompt")}>
              <span className="cp-btn__glyph" aria-hidden="true">
                {copied === "prompt" ? "✓" : "⧉"}
              </span>
              {copied === "prompt" ? "Prompt copied" : "Copy agent prompt"}
            </button>
            <a className="cp-btn cp-btn--text" href={LINKS.github}>
              <GitHubIcon /> GitHub <b>{STATUS.version}</b>
            </a>
          </div>
          <p className="cp-sr" role="status">
            {copied === "prompt" ? "Agent prompt copied to clipboard" : ""}
          </p>
          <ul className="cp-meta" aria-label="Project facts">
            <li>{STATUS.version} · {STATUS.stage}</li>
            <li>{STATUS.license}</li>
            <li>Go</li>
            <li>Bubblewrap</li>
            <li>gVisor</li>
          </ul>
        </div>
        <div className="cp-hero__chamber">
          <Chamber reduced={reduced} />
        </div>
      </div>
    </section>
  );
}

function Paranoia() {
  return (
    <div className="cp-paranoia" data-reveal>
      <span className="cp-paranoia__haz" aria-hidden="true" />
      <p className="cp-paranoia__txt">
        <span className="cp-paranoia__num">
          5.3<small>MiB</small>
        </span>
        <span className="cp-paranoia__words">of paranoia per sandbox.</span>
      </p>
      <div className="cp-paranoia__meta" aria-hidden="true">
        <Barcode seed="paranoia" ink="#E9E6DC" length={140} />
        <span>idle · measured · bwrap</span>
      </div>
      <span className="cp-paranoia__haz cp-paranoia__haz--r" aria-hidden="true" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="cp-foot">
      <span className="cp-reg cp-reg--l" aria-hidden="true" />
      <span className="cp-reg cp-reg--r" aria-hidden="true" />
      <div className="cp-wrap cp-foot__grid">
        <div className="cp-foot__brand">
          <div className="cp-brand">
            <MarkCell size={26} />
            <span className="cp-brand__word">Vora</span>
            <span className="cp-brand__sub">/ containment runtime</span>
          </div>
          <p>Contain it. Watch it. Prove it.</p>
        </div>
        <nav className="cp-foot__links" aria-label="Footer">
          <a href={LINKS.github}>GitHub</a>
          <a href={LINKS.docs}>Docs</a>
          <a href={LINKS.threatModel}>Threat model</a>
          <a href={LINKS.adrs}>ADRs</a>
          <a href={LINKS.examples}>Examples</a>
          <a href={LINKS.probe}>Probe</a>
          <a href="/llms.txt">llms.txt</a>
        </nav>
        <div className="cp-foot__legal">
          <p>
            {STATUS.license} · © {new Date().getFullYear()} Vora
          </p>
          <p className="cp-foot__eod">End of document · sheet 10 / 10</p>
        </div>
      </div>
    </footer>
  );
}
