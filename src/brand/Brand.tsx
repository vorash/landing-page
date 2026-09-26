import { useEffect } from "react";
import currentLogo from "figma:asset/56c1b48946cb3dda8fe48e817c7791c546b7dd92.png";
import { MARKS } from "../shared/logos";
import { useFonts } from "../shared/hooks";
import "./brand.css";

const FONT_URLS = [
  "https://api.fontshare.com/v2/css?f[]=sentient@1,2&display=swap",
  "https://api.fontshare.com/v2/css?f[]=switzer@1,2&display=swap",
  "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300..700&family=JetBrains+Mono:wght@400;500&family=Big+Shoulders:opsz,wght@10..72,100..900&family=IBM+Plex+Sans+Condensed:wght@400;500;600&family=Martian+Mono:wdth,wght@75..112.5,100..800&family=Fragment+Mono:ital@0;1&display=swap",
];

const DIRECTIONS = [
  {
    key: "horizon",
    letter: "A",
    name: "Event Horizon",
    line: "Nothing escapes. Everything is remembered.",
    idea: "Vora as a black hole: vorāre is Latin for “to swallow whole”. Hostile commands spiral in and vanish; the only thing that leaks out is the audit trail — Hawking radiation as a flight recorder.",
    mood: "Cinematic · editorial · warm",
    bg: "#050403",
    fg: "#f4ede4",
    swatches: [
      { hex: "#050403", name: "Void" },
      { hex: "#FF8A3D", name: "Accretion", note: "8.7:1 on void" },
      { hex: "#FFD9A8", name: "Photon" },
      { hex: "#FF5A1F", name: "Ember" },
      { hex: "#A39A90", name: "Dust", note: "7.4:1 text" },
    ],
    type: [
      { role: "Display", family: "Sentient", css: "'Sentient', serif", weight: 200, sample: "Nothing escapes.", note: "Fontshare · ITF FFL" },
      { role: "Text", family: "Hanken Grotesk", css: "'Hanken Grotesk', sans-serif", weight: 400, sample: "Sealed Linux sandboxes for agents.", note: "Google · OFL" },
      { role: "Mono", family: "JetBrains Mono", css: "'JetBrains Mono', monospace", weight: 400, sample: "egress 169.254.169.254 DENIED", note: "Google · OFL" },
    ],
    visual: "Real-time WebGL black hole (lensed stars, Doppler-beamed disk, photon ring), infalling command particles, orbit diagram, fork timelines.",
    mark: "horizon",
  },
  {
    key: "containment",
    letter: "B",
    name: "Containment Protocol",
    line: "Contain it. Watch it. Prove it.",
    idea: "Vora as a biosafety-level-4 lab for code: every workload is a hazardous specimen. Hazard tape, specimen labels, technical cross-sections and rubber stamps turn security into something you can see.",
    mood: "Brutalist · industrial · loud",
    bg: "#0B0B0A",
    fg: "#E9E6DC",
    swatches: [
      { hex: "#0B0B0A", name: "Blackout" },
      { hex: "#D4FF3F", name: "Signal", note: "17.0:1 on blackout" },
      { hex: "#FF4A1C", name: "Breach" },
      { hex: "#FFD400", name: "Hazard", note: "stripes only" },
      { hex: "#E9E6DC", name: "Bone" },
    ],
    type: [
      { role: "Display", family: "Big Shoulders", css: "'Big Shoulders', sans-serif", weight: 900, sample: "CONTAIN IT.", note: "Google · OFL" },
      { role: "Text", family: "IBM Plex Sans Condensed", css: "'IBM Plex Sans Condensed', sans-serif", weight: 400, sample: "Assume every workload is malicious.", note: "Google · OFL" },
      { role: "Mono", family: "Martian Mono", css: "'Martian Mono', monospace", weight: 400, sample: "CTN-004 · PidsLimitExceeded", note: "Google · OFL" },
    ],
    visual: "Interactive specimen chamber (inject a fork bomb, watch it stamped CONTAINED), SVG cross-section of 7 layers, lab-ledger audit trail.",
    mark: "cell",
  },
  {
    key: "cleanroom",
    letter: "C",
    name: "Clean Room",
    line: "A clean room for dirty code.",
    idea: "Vora as a semiconductor clean room: pristine, calm, measured. A frosted glass cube holds a restless agent; every wall it touches annotates itself. Light mode stands out in a category of black pages.",
    mood: "Swiss · precise · luminous",
    bg: "#F6F6F3",
    fg: "#0D0E12",
    swatches: [
      { hex: "#F6F6F3", name: "Room" },
      { hex: "#2B59FF", name: "Current blue", note: "5.3:1 on white" },
      { hex: "#0D0E12", name: "Ink" },
      { hex: "#C5B8FF", name: "Film", note: "glass edges only" },
      { hex: "#585B63", name: "Graphite", note: "6.3:1 text" },
    ],
    type: [
      { role: "Display", family: "Switzer", css: "'Switzer', sans-serif", weight: 600, sample: "A clean room.", note: "Fontshare · ITF FFL" },
      { role: "Text", family: "Switzer", css: "'Switzer', sans-serif", weight: 400, sample: "Sealed, budgeted and recorded.", note: "Fontshare · ITF FFL" },
      { role: "Mono", family: "Fragment Mono", css: "'Fragment Mono', monospace", weight: 400, sample: "network: none · ttl 10m", note: "Google · OFL" },
    ],
    visual: "CSS-3D frosted glass cube with a bouncing agent orb, airlock diagram for secretless credentials, instrument-panel feature grid.",
    mark: "prism",
  },
] as const;

const TAGLINES = [
  "Nothing escapes. Everything is remembered.",
  "Contain it. Watch it. Prove it.",
  "A clean room for dirty code.",
  "Default deny. Total recall.",
  "Let it run. Let nothing out.",
  "Sandboxes that keep receipts.",
  "5.3 MiB of paranoia per sandbox.",
  "Fork reality. Keep the timeline that passes.",
  "Give agents a shell, not your secrets.",
  "Your laptop is not a sandbox.",
];

const AVOID = [
  "“A computer for every agent” — E2B, Blaxel, Morph, Sprites all use it",
  "“Code you didn't write” — Vercel & Northflank own it",
  "Lightning fast · enterprise-grade · seamless · at scale",
  "Racing on cold-start ms (rivals claim 25–90 ms; we measure 1.1 s)",
  "Invented stats: the old page's 99.99% SLA, 30 regions, 10k deploys/day",
];

const VOICE = [
  { t: "Say what it does, then what it doesn't.", d: "Honesty is the differentiator: every page carries the v0.7 limits." },
  { t: "Show the terminal, not the adjective.", d: "Real commands, real outputs — BLOCKED beats “secure”." },
  { t: "Evidence over capability.", d: "Everyone gives agents a computer. We give you the record of what they did." },
  { t: "One metaphor per surface.", d: "Horizon, containment or clean room — never mixed on the same page." },
];

export default function Brand() {
  useFonts(FONT_URLS[0]);
  useFonts(FONT_URLS[1]);
  useFonts(FONT_URLS[2]);
  useEffect(() => {
    document.title = "Vora — Brand board";
  }, []);

  return (
    <div className="bb">
      <header className="bb-head">
        <p className="bb-eyebrow">Vora · brand board · Sep 2026</p>
        <h1>From “edge platform” to the runtime that keeps agents honest.</h1>
        <p className="bb-lede">
          The current site sells an edge-deployment product that no longer exists. Vora is now a sandbox runtime for AI
          agents and untrusted code, with Probe as its first flagship workload. Three directions below — each a full,
          working landing page — plus five logo concepts and a shared messaging system.
        </p>
        <div className="bb-positioning">
          <span>Positioning</span>
          <p>
            <b>For</b> teams putting AI agents and untrusted code in production, <b>Vora is</b> the open-source execution
            runtime that <b>contains, observes and proves</b> what that code did — default-deny, secretless, on the record —
            <b>on any Linux box</b>, without Kubernetes or KVM.
          </p>
        </div>
      </header>

      <section className="bb-sec">
        <div className="bb-sec__head">
          <h2>Logo concepts</h2>
          <p>Every mark is drawn on a 64-unit grid and checked at 16px. Today's logo is shown first for reference.</p>
        </div>
        <div className="bb-marks">
          <article className="bb-mark bb-mark--current">
            <div className="bb-mark__tiles">
              <div className="bb-tile bb-tile--light bb-tile--wide">
                <img src={currentLogo} alt="Current Vora logo" />
              </div>
            </div>
            <h3>Current</h3>
            <p>Circuit-trace V with a blue→cyan gradient. Recognisable, but the traces blur below 32px and the heavy wordmark reads generic.</p>
          </article>
          {MARKS.map(({ key, name, Mark, story, pairs }) => (
            <article key={key} className="bb-mark">
              <div className="bb-mark__tiles">
                <div className="bb-tile bb-tile--dark">
                  <Mark size={96} />
                </div>
                <div className="bb-tile bb-tile--light">
                  <Mark size={96} tone="mono" />
                </div>
              </div>
              <div className="bb-sizes">
                {[16, 24, 32, 48].map((s) => (
                  <span key={s} className="bb-size">
                    <Mark size={s} />
                    <small>{s}</small>
                  </span>
                ))}
                <span className="bb-size bb-size--app">
                  <span className="bb-app">
                    <Mark size={34} tone="mono" />
                  </span>
                  <small>app</small>
                </span>
              </div>
              <h3>
                {name} <em>pairs with {pairs}</em>
              </h3>
              <p>{story}</p>
              <div className="bb-lockup">
                <Mark size={28} />
                <span>vora</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bb-sec">
        <div className="bb-sec__head">
          <h2>Three directions</h2>
          <p>All three share the same facts, sections and honesty. Only the metaphor, type and color change.</p>
        </div>
        <div className="bb-dirs">
          {DIRECTIONS.map((d) => {
            const Mark = MARKS.find((m) => m.key === d.mark)!.Mark;
            return (
              <article key={d.key} className="bb-dir">
                <a href={`#${d.key}`} className="bb-dir__hero" style={{ background: d.bg, color: d.fg }}>
                  <span className="bb-dir__letter">{d.letter}</span>
                  <Mark size={40} />
                  <p className={`bb-dir__line bb-dir__line--${d.key}`}>{d.line}</p>
                  <span className="bb-dir__open">Open page →</span>
                </a>
                <div className="bb-dir__body">
                  <h3>{d.name}</h3>
                  <p className="bb-dir__mood">{d.mood}</p>
                  <p>{d.idea}</p>
                  <div className="bb-swatches">
                    {d.swatches.map((s) => (
                      <div key={s.hex} className="bb-swatch">
                        <span style={{ background: s.hex }} />
                        <b>{s.name}</b>
                        <code>{s.hex}</code>
                        {"note" in s && <small>{s.note}</small>}
                      </div>
                    ))}
                  </div>
                  <div className="bb-type">
                    {d.type.map((t) => (
                      <div key={t.role} className="bb-type__row">
                        <div className="bb-type__meta">
                          <span>{t.role}</span>
                          <b>{t.family}</b>
                          <small>{t.note}</small>
                        </div>
                        <p style={{ fontFamily: t.css, fontWeight: t.weight }}>{t.sample}</p>
                      </div>
                    ))}
                  </div>
                  <p className="bb-dir__visual">
                    <b>Imagery</b> {d.visual}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bb-sec bb-msg">
        <div>
          <h2>Tagline bank</h2>
          <ol className="bb-tags">
            {TAGLINES.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </div>
        <div>
          <h2>Voice</h2>
          <ul className="bb-voice">
            {VOICE.map((v) => (
              <li key={v.t}>
                <b>{v.t}</b>
                <span>{v.d}</span>
              </li>
            ))}
          </ul>
          <h2 className="bb-avoid__h">Avoid</h2>
          <ul className="bb-avoid">
            {AVOID.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
