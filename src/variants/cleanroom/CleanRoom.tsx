import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { MarkPrism } from "../../shared/logos";
import { highlight } from "../../shared/highlight";
import { useCopy, useFonts, useInView, useReducedMotion, useReveal, useTypewriter } from "../../shared/hooks";
import {
  AGENT_PROMPT, ATTACKS, AUDIT_LOG, BENCH, CODE, CODE_TABS, FAQ, LIMITS, LINKS,
  PROBE, STATS, STATUS, USE_CASES,
} from "../../shared/content";
import { GlassCube } from "./GlassCube";
import { Instruments } from "./Instruments";
import { Arrow, GitHubIcon, ProtocolIcon, SecHead } from "./parts";
import "./cleanroom.css";

const FONT_SANS = "https://api.fontshare.com/v2/css?f[]=switzer@1,2&display=swap";
const FONT_MONO = "https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&display=swap";

const WORKS = ["Claude Code (MCP)", "Cursor (MCP)", "OpenAI Agents SDK", "TypeScript", "Python", "any Linux box"];

type Theme = "day" | "night";
const THEME_KEY = "vora-cr-theme";

function initialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "day" || saved === "night") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
}

// Switches theme with a circular reveal from the pointer where the View
// Transitions API exists; otherwise the CSS colour transition does the work.
function useTheme(reduced: boolean) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggle = (origin?: { x: number; y: number }) => {
    const next: Theme = theme === "day" ? "night" : "day";
    const apply = () => flushSync(() => setTheme(next));
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (!doc.startViewTransition || reduced) return apply();
    const x = origin?.x ?? window.innerWidth - 80;
    const y = origin?.y ?? 32;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    doc.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  return { theme, toggle };
}

export default function CleanRoom() {
  useFonts(FONT_SANS);
  useFonts(FONT_MONO);
  const reduced = useReducedMotion();
  const root = useReveal<HTMLDivElement>();
  const { theme, toggle } = useTheme(reduced);

  useEffect(() => {
    document.title = "Vora — A clean room for dirty code.";
  }, []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "n" && !e.metaKey && !e.ctrlKey && !e.altKey) toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="cr" ref={root} data-theme={theme}>
      <a className="cr-skip" href="#cr-main">Skip to content</a>
      <Nav theme={theme} onToggle={toggle} />
      <main id="cr-main">
        <Hero reduced={reduced} />
        <WorksWith />
        <Airlock reduced={reduced} />
        <Instruments reduced={reduced} />
        <Break reduced={reduced} />
        <Protocol />
        <Fork reduced={reduced} />
        <Build />
        <ProbeSection />
        <Honest />
        <Final reduced={reduced} />
      </main>
      <Footer />
    </div>
  );
}

/* ───────────────────────────── Nav ───────────────────────────── */

function Nav({ theme, onToggle }: { theme: Theme; onToggle: (o?: { x: number; y: number }) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const night = theme === "night";
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={`cr-nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Primary">
      <div className="cr-nav__in cr-wrap">
        <a href="#top" className="cr-logo" aria-label="Vora home">
          <MarkPrism size={26} />
          <span>vora</span>
        </a>
        <div className="cr-nav__links">
          <a href="#instruments">Product</a>
          <a href="#airlock">Security</a>
          <a href="#build">Build</a>
          <a href="#probe">Probe</a>
          <a href={LINKS.github}>GitHub</a>
        </div>
        <div className="cr-nav__right">
          <button
            type="button"
            className={`cr-lights ${night ? "is-night" : ""}`}
            aria-pressed={night}
            aria-label={night ? "Switch to day mode (n)" : "Switch to night mode (n)"}
            title={night ? "Lights on (n)" : "Night shift (n)"}
            onClick={(e) => {
              const b = e.currentTarget.getBoundingClientRect();
              onToggle({ x: b.left + b.width / 2, y: b.top + b.height / 2 });
            }}
          >
            <span className="cr-lights__track" aria-hidden="true">
              <span className="cr-lights__knob">
                <svg viewBox="0 0 24 24" className="cr-lights__sun">
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
                </svg>
                <svg viewBox="0 0 24 24" className="cr-lights__moon">
                  <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
                </svg>
              </span>
            </span>
            <span className="cr-lights__label">{night ? "Night" : "Day"}</span>
          </button>
          <a className="cr-vpill" href="#honest" aria-label={`${STATUS.version}, ${STATUS.stage}`}>
            <i aria-hidden="true" />
            {STATUS.version}
          </a>
          <a className="cr-btn cr-btn--primary cr-btn--sm" href={LINKS.github}>
            Get started
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ───────────────────────────── Hero ───────────────────────────── */

function Hero({ reduced }: { reduced: boolean }) {
  const { copied, copy } = useCopy();
  return (
    <header className="cr-hero" id="top">
      <div className="cr-hero__bg" aria-hidden="true" />
      <div className="cr-wrap cr-hero__grid">
        <div className="cr-hero__copy">
          <p className="cr-pill">
            <span className="cr-pill__dot" aria-hidden="true" />
            Default deny. Total recall.
          </p>
          <h1 className="cr-h1">
            <span className="cr-h1__a">A clean room</span>{" "}
            <span className="cr-h1__b">
              for <span className="cr-h1__dirty">dirty</span> code.
            </span>
          </h1>
          <p className="cr-lede">
            Give AI agents, generated scripts and untrusted PRs a real Linux box to work in — sealed,
            budgeted and recorded. Vora keeps whatever they do inside the room, and writes down everything
            they tried.
          </p>
          <div className="cr-ctas">
            <a className="cr-btn cr-btn--primary" href={LINKS.github}>
              Get started <Arrow />
            </a>
            <button type="button" className="cr-btn cr-btn--glass" onClick={() => copy(AGENT_PROMPT, "prompt")}>
              <CopyGlyph done={copied === "prompt"} />
              {copied === "prompt" ? "Prompt copied" : "Copy agent prompt"}
            </button>
            <a className="cr-tlink" href={LINKS.threatModel}>
              Read the threat model <Arrow />
            </a>
          </div>
          <span className="cr-sr" aria-live="polite">
            {copied === "prompt" ? "Agent prompt copied to clipboard." : ""}
          </span>
          <p className="cr-fine">
            <span>Open source</span>
            <span>{STATUS.license}</span>
            <span>One Go binary</span>
            <span>No Kubernetes</span>
          </p>
        </div>
        <div className="cr-hero__visual">
          <GlassCube reduced={reduced} />
        </div>
      </div>
    </header>
  );
}

function CopyGlyph({ done }: { done: boolean }) {
  return done ? (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m3 8.5 3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="8.5" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 3.2A1.7 1.7 0 0 0 9.5 2.5H4.2A1.7 1.7 0 0 0 2.5 4.2v5.3c0 .7.4 1.2 1 1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/* ───────────────────────────── Works with ───────────────────────────── */

function WorksWith() {
  return (
    <section className="cr-works" aria-label="Works with">
      <div className="cr-wrap cr-works__in" data-reveal>
        <p className="cr-works__label">Works with</p>
        <ul className="cr-works__list">
          {WORKS.map((w) => (
            <li key={w}>
              <i aria-hidden="true" />
              {w}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────────── Airlock ───────────────────────────── */

const BROKER_ROW = AUDIT_LOG.find((r) => r.text.includes("alias=github"));

function Airlock({ reduced }: { reduced: boolean }) {
  const [ref, inView] = useInView<HTMLElement>(0.3);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase(3);
      return;
    }
    if (!inView) return;
    const id = window.setInterval(() => setPhase((p) => (p + 1) % 6), 1350);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const pos = [0, 1, 1, 2, 1, 0][phase];
  const keyed = phase === 2 || phase === 3;
  const doorA = phase === 1 || phase === 5;
  const doorB = phase === 3 || phase === 4;
  const response = phase >= 4;

  return (
    <section className="cr-sec cr-air" id="airlock" ref={ref} aria-labelledby="cr-air-title">
      <div className="cr-wrap">
        <SecHead
          n="01"
          label="The airlock · secretless credentials"
          title={<span id="cr-air-title">Your agent calls GitHub. <span className="cr-soft">It never holds the key.</span></span>}
          sub="The token lives encrypted in the control plane. The egress gateway attaches it upstream over TLS — it never enters the sandbox env, its filesystem, /proc, or the audit log."
        />

        <div className={`cr-air__rig ${reduced ? "is-static" : ""}`} data-reveal data-phase={phase}>
          <div className="cr-air__chamber cr-air__chamber--in">
            <p className="cr-air__tag"><b>A</b> inside the room</p>
            <h3>sandbox</h3>
            <pre className="cr-air__term">
              <span className="tk-prompt">$ </span>env | grep -i token{"\n"}
              <span className="cr-muted">(no output)</span>{"\n"}
              <span className="tk-prompt">$ </span>env | grep VORA{"\n"}
              VORA_BROKER_URL=…
            </pre>
            <p className="cr-air__note">Sees one thing: <code>$VORA_BROKER_URL</code></p>
          </div>

          <div className={`cr-door ${doorA ? "is-open" : ""}`} aria-hidden="true"><i /><i /></div>

          <div className="cr-air__chamber cr-air__chamber--lock">
            <p className="cr-air__tag"><b>B</b> airlock</p>
            <h3>egress gateway</h3>
            <div className={`cr-vault ${keyed ? "is-lending" : ""}`}>
              <span className="cr-vault__label">control plane · encrypted</span>
              <span className="cr-vault__tok">alias=github · ghp_••••••••</span>
            </div>
            <p className="cr-air__note">Attaches the token over TLS, only for <code>api.github.com</code></p>
          </div>

          <div className={`cr-door ${doorB ? "is-open" : ""}`} aria-hidden="true"><i /><i /></div>

          <div className="cr-air__chamber cr-air__chamber--out">
            <p className="cr-air__tag"><b>C</b> outside</p>
            <h3>api.github.com</h3>
            <div className={`cr-air__recv ${phase === 3 ? "is-hit" : ""}`}>
              <span>Authorization</span>
              <b>Bearer ghp_••••</b>
            </div>
            <p className="cr-air__note">The only place the key ever appears.</p>
          </div>

          <div className="cr-packet-lane" aria-hidden="true">
            <div className={`cr-packet ${response ? "is-resp" : ""}`} style={{ ["--pos" as string]: pos }}>
              <span className="cr-packet__verb">{response ? "200 OK" : "GET /user"}</span>
              <span className={`cr-packet__key ${keyed ? "is-on" : ""}`}>
                {keyed ? "+ token" : "no key"}
              </span>
            </div>
          </div>
        </div>

        <div className="cr-air__foot" data-reveal>
          <p className="cr-air__audit">
            <span className="cr-mono-k">audit</span>
            <code>{BROKER_ROW?.t}</code>
            <code>egress {BROKER_ROW?.text}</code>
          </p>
          <p className="cr-air__honest">
            <b>Plainly:</b> brokering is an explicit route, not a transparent MITM — your code calls the
            broker URL on purpose. <code>vora secrets set --alias github</code>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Try to break it ───────────────────────────── */

function Break({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [ref, inView] = useInView<HTMLElement>(0.3);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const attack = ATTACKS[active];
  const cmd = `vora exec sbx_01M2… -- ${attack.command}`;
  const typed = useTypewriter(cmd, inView && !reduced, 16);
  const shown = reduced ? cmd : cmd.startsWith(typed) ? typed : "";
  const done = shown === cmd;
  const [lines, setLines] = useState(0);

  useEffect(() => {
    if (!done) {
      setLines(0);
      return;
    }
    if (reduced) {
      setLines(attack.output.length + 1);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setLines(i);
      if (i > attack.output.length) window.clearInterval(id);
    }, 360);
    return () => window.clearInterval(id);
  }, [done, active, reduced, attack.output.length]);

  const finished = lines > attack.output.length;

  useEffect(() => {
    if (!auto || !inView || !finished || reduced) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % ATTACKS.length), 2800);
    return () => window.clearTimeout(id);
  }, [auto, inView, finished, reduced]);

  const pick = (i: number, focus = false) => {
    setActive(i);
    setAuto(false);
    if (focus) tabs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = ATTACKS.length;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); pick((active + 1) % n, true); }
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); pick((active - 1 + n) % n, true); }
    else if (e.key === "Home") { e.preventDefault(); pick(0, true); }
    else if (e.key === "End") { e.preventDefault(); pick(n - 1, true); }
  };

  return (
    <section className="cr-sec cr-break" id="break" ref={ref} aria-labelledby="cr-break-title">
      <div className="cr-wrap">
        <SecHead
          n="03"
          label="Stress test"
          title={<span id="cr-break-title">Try to break it. <span className="cr-soft">Everyone does.</span></span>}
          sub="Vora assumes every workload is hostile. These are real commands and the literal answers a sandbox gives back — the host never notices."
        />
        <div className="cr-break__grid" data-reveal>
          <div className="cr-break__list" role="tablist" aria-label="Attacks" aria-orientation="vertical" onKeyDown={onKey}>
            {ATTACKS.map((a, i) => (
              <button
                key={a.id}
                ref={(el) => { tabs.current[i] = el; }}
                role="tab"
                id={`cr-atk-${a.id}`}
                aria-selected={i === active}
                aria-controls="cr-atk-panel"
                tabIndex={i === active ? 0 : -1}
                className={`cr-atk ${i === active ? "is-on" : ""}`}
                onClick={() => pick(i)}
              >
                <span className="cr-atk__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="cr-atk__body">
                  <span className="cr-atk__name">{a.name}</span>
                  <span className="cr-atk__intent">{a.intent}</span>
                </span>
                <span className="cr-atk__v">{a.verdict}</span>
              </button>
            ))}
          </div>

          <div className="cr-term" role="tabpanel" id="cr-atk-panel" aria-labelledby={`cr-atk-${attack.id}`}>
            <div className="cr-term__bar">
              <span className="cr-term__dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="cr-term__title">sbx_01M2…EW3 — {attack.name.toLowerCase()}</span>
              <span className="cr-term__live" aria-hidden="true">{auto && !reduced ? "auto" : "manual"}</span>
            </div>
            <p className="cr-sr">
              Command: {cmd}. Output: {attack.output.join(" ")}. Verdict: {attack.verdict}. Stopped by {attack.boundary}.
            </p>
            <pre className="cr-term__body" aria-hidden="true">
              <span className="cr-term__com"># {attack.intent}</span>
              {"\n"}
              <span className="tk-prompt">$ </span>
              <span className="cr-term__cmd">{shown}</span>
              {!done && <span className="cr-caret" />}
              {"\n"}
              {attack.output.slice(0, lines).map((l, i) => (
                <span key={`${attack.id}-${i}`} className="cr-term__out">
                  {l}
                  {"\n"}
                </span>
              ))}
            </pre>
            <div className={`cr-term__foot ${finished ? "is-in" : ""}`} aria-hidden="true">
              <span className="cr-verdict">{attack.verdict}</span>
              <span className="cr-term__boundary">
                <span className="cr-mono-k">stopped by</span> {attack.boundary}
              </span>
              <span className="cr-term__rec">host unaffected · on the record</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Protocol ───────────────────────────── */

const PROTOCOL = [
  {
    icon: "gown" as const,
    title: "Gown up",
    verb: "create",
    text: "Decide the budget before anything runs: image, memory, CPU, PIDs, TTL and network.",
    code: "$ vora sandbox create \\\n    --image vora/python \\\n    --memory 512m --cpu 1 \\\n    --pids 128 --network none",
  },
  {
    icon: "enter" as const,
    title: "Enter",
    verb: "exec",
    text: "Write into /workspace and run the job. The rest of the filesystem is read-only.",
    code: "$ vora exec sbx_01M2… -- python3 main.py",
  },
  {
    icon: "observe" as const,
    title: "Observe",
    verb: "logs · stats · egress",
    text: "Lifecycle events, every execution and every allowed or denied connection, as they happen.",
    code: "$ vora logs sbx_01M2… --egress",
  },
  {
    icon: "decon" as const,
    title: "Decontaminate",
    verb: "destroy · ttl",
    text: "Tear the room down when you're done — or let the TTL do it, with TimeoutExceeded on the record.",
    code: "await box.destroy();\n// or: ttl: \"10m\"",
  },
];

function Protocol() {
  const [ref, inView] = useInView<HTMLElement>(0.25);
  return (
    <section className={`cr-sec cr-proto ${inView ? "is-live" : ""}`} ref={ref} aria-labelledby="cr-proto-title">
      <div className="cr-wrap">
        <SecHead
          n="04"
          label="Entry protocol"
          title={<span id="cr-proto-title">Gown up. Enter. Observe. <span className="cr-soft">Decontaminate.</span></span>}
          sub="The whole lifecycle of a sandbox, in the order a clean room would insist on."
        />
        <div className="cr-proto__rail" aria-hidden="true"><i /></div>
        <ol className="cr-proto__steps">
          {PROTOCOL.map((s, i) => (
            <li key={s.title} className="cr-step" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="cr-step__head">
                <span className="cr-step__icon"><ProtocolIcon kind={s.icon} /></span>
                <span className="cr-step__n">{String(i + 1).padStart(2, "0")} / 04</span>
              </div>
              <h3 className="cr-step__title">{s.title}</h3>
              <p className="cr-step__verb">{s.verb}</p>
              <p className="cr-step__text">{s.text}</p>
              <pre className="cr-step__code">{highlight(s.code)}</pre>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────────── Fork ───────────────────────────── */

const FORKS = [
  { id: "a", label: "patch A", result: "pytest · 3 failed", ok: false },
  { id: "b", label: "patch B", result: "exit 0 · 214 passed", ok: true },
  { id: "c", label: "patch C", result: "OOMKilled", ok: false },
  { id: "d", label: "patch D", result: "TimeoutExceeded", ok: false },
];

function MiniCube({ tone = "idle" }: { tone?: "idle" | "ok" | "bad" | "src" }) {
  return (
    <span className={`cr-mcube cr-mcube--${tone}`} aria-hidden="true">
      <span className="cr-mcube__body">
        <i className="f1" /><i className="f2" /><i className="f3" /><i className="f4" /><i className="f5" /><i className="f6" />
        <b className="cr-mcube__orb" />
      </span>
    </span>
  );
}

function Fork({ reduced }: { reduced: boolean }) {
  const [ref, inView] = useInView<HTMLElement>(0.35);
  const [live, setLive] = useState(reduced);
  useEffect(() => {
    if (reduced || inView) setLive(true);
  }, [inView, reduced]);

  return (
    <section className={`cr-sec cr-fork ${live ? "is-live" : ""}`} id="fork" ref={ref} aria-labelledby="cr-fork-title">
      <div className="cr-wrap">
        <SecHead
          n="05"
          label="Snapshot & fork"
          title={<span id="cr-fork-title">Fork the room. <span className="cr-soft">Keep the one that passes.</span></span>}
          sub="Capture a running sandbox live, fork independent copies from the exact same state, and let N candidate patches race. Forks never see each other's writes."
        />
        <div className="cr-fork__stage" data-reveal>
          <div className="cr-fork__src">
            <MiniCube tone="src" />
            <p className="cr-fork__id">
              <span>sbx_01M2…</span>
              <b>snapshot</b>
            </p>
          </div>
          <svg className="cr-fork__wires" viewBox="0 0 200 400" preserveAspectRatio="none" aria-hidden="true">
            {FORKS.map((f, i) => {
              const y = 50 + i * 100;
              return (
                <path
                  key={f.id}
                  d={`M0 200 C 100 200, 100 ${y}, 200 ${y}`}
                  className={`cr-fork__wire ${f.ok ? "is-ok" : ""}`}
                  style={{ transitionDelay: `${0.2 + i * 0.12}s` }}
                  pathLength={1}
                />
              );
            })}
          </svg>
          <ul className="cr-fork__list">
            {FORKS.map((f, i) => (
              <li
                key={f.id}
                className={`cr-forkitem ${f.ok ? "is-ok" : "is-bad"}`}
                style={{ ["--i" as string]: i }}
              >
                <MiniCube tone={f.ok ? "ok" : "bad"} />
                <span className="cr-forkitem__label">{f.label}</span>
                <span className="cr-forkitem__res">{f.result}</span>
              </li>
            ))}
          </ul>
        </div>
        <pre className="cr-fork__cmd" data-reveal>
          {highlight("$ vora snapshot create sbx_01M2…\n$ vora snapshot fork snap_…   # ×4, one per candidate patch")}
        </pre>
      </div>
    </section>
  );
}

/* ───────────────────────────── Build ───────────────────────────── */

function Build() {
  const [tab, setTab] = useState<(typeof CODE_TABS)[number]["key"]>("typescript");
  const [bench, setBench] = useState(false);
  const { copied, copy } = useCopy();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = CODE_TABS.findIndex((t) => t.key === tab);
    const n = CODE_TABS.length;
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setTab(CODE_TABS[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="cr-sec cr-build" id="build" aria-labelledby="cr-build-title">
      <div className="cr-wrap">
        <SecHead
          n="06"
          label="Build"
          title={<span id="cr-build-title">Twelve lines <span className="cr-soft">to a sealed room.</span></span>}
          sub="A zero-dependency SDK, a CLI, and an MCP server your coding agent can call directly."
        />
        <div className="cr-build__grid">
          <div className="cr-code" data-reveal>
            <div className="cr-code__bar">
              <div className="cr-code__tabs" role="tablist" aria-label="Code examples" onKeyDown={onKey}>
                {CODE_TABS.map((t, i) => (
                  <button
                    key={t.key}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    role="tab"
                    id={`cr-tab-${t.key}`}
                    aria-selected={tab === t.key}
                    aria-controls="cr-code-panel"
                    tabIndex={tab === t.key ? 0 : -1}
                    className={tab === t.key ? "is-on" : ""}
                    onClick={() => setTab(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <button type="button" className="cr-code__copy" onClick={() => copy(CODE[tab], tab)}>
                <CopyGlyph done={copied === tab} />
                {copied === tab ? "Copied" : "Copy"}
              </button>
              <span className="cr-sr" aria-live="polite">{copied === tab ? "Code copied to clipboard." : ""}</span>
            </div>
            <pre
              className="cr-code__body"
              role="tabpanel"
              id="cr-code-panel"
              aria-labelledby={`cr-tab-${tab}`}
              tabIndex={0}
            >
              <code>{highlight(CODE[tab])}</code>
            </pre>
          </div>

          <div className="cr-stats" data-reveal>
            <dl className="cr-stats__grid">
              {STATS.map((s) => (
                <div key={s.label} className="cr-stat">
                  <dt className="cr-stat__l">{s.label}</dt>
                  <dd className="cr-stat__v">
                    {s.value}
                    {s.unit && <small>{s.unit}</small>}
                  </dd>
                  <dd className="cr-stat__n">{s.note}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              className="cr-disclose"
              aria-expanded={bench}
              aria-controls="cr-bench"
              onClick={() => setBench((b) => !b)}
            >
              <span>Raw benchmark</span>
              <span className="cr-disclose__sign" aria-hidden="true" />
            </button>
            <div className="cr-bench" id="cr-bench" hidden={!bench}>
              <p className="cr-bench__host">{BENCH.host}</p>
              <dl>
                {BENCH.rows.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="cr-uses" data-reveal>
          <p className="cr-uses__label">What goes in the room</p>
          <ul className="cr-uses__list">
            {USE_CASES.map((u, i) => (
              <li key={u.title}>
                <span className="cr-uses__n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{u.title}</h3>
                <p>{u.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Probe ───────────────────────────── */

function ProbeSection() {
  return (
    <section className="cr-sec cr-probe" id="probe" aria-labelledby="cr-probe-title">
      <div className="cr-wrap">
        <article className="cr-probe__card" data-reveal>
          <div className="cr-probe__head">
            <p className="cr-probe__badge">
              <MarkPrism size={16} tone="mono" /> Built on Vora
            </p>
            <p className="cr-probe__name">{PROBE.name}</p>
            <h2 className="cr-h2" id="cr-probe-title">{PROBE.tagline}</h2>
            <p className="cr-sub">{PROBE.description}</p>
          </div>
          <ul className="cr-probe__refusals">
            {PROBE.refusals.map((r, i) => (
              <li key={r.title} className="cr-refusal">
                <span className="cr-refusal__mark" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M5.8 18.2 18.2 5.8" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                <span className="cr-refusal__n">refusal {String(i + 1).padStart(2, "0")}</span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
          <div className="cr-probe__foot">
            <blockquote className="cr-probe__quote">
              <p>“{PROBE.finding}”</p>
            </blockquote>
            <div className="cr-probe__run">
              <pre>{highlight(`$ ${PROBE.command}`)}</pre>
              <a className="cr-tlink" href={LINKS.probe}>
                Explore Probe <Arrow />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ───────────────────────────── Honest ───────────────────────────── */

function Honest() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="cr-sec cr-honest" id="honest" aria-labelledby="cr-honest-title">
      <div className="cr-wrap cr-honest__grid">
        <div data-reveal>
          <SecHead
            n="07"
            label={`${STATUS.stage}`}
            title={<span id="cr-honest-title">{STATUS.version}, <span className="cr-soft">stated plainly.</span></span>}
          />
          <ul className="cr-limits">
            {LIMITS.map((l, i) => (
              <li key={l}>
                <span className="cr-limits__n">L{i + 1}</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
          <p className="cr-next">
            <span className="cr-mono-k">next</span> {STATUS.next}
          </p>
        </div>
        <div className="cr-faq" data-reveal>
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`cr-faq__item ${isOpen ? "is-open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    id={`cr-faq-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`cr-faq-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="cr-disclose__sign" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="cr-faq__a"
                  id={`cr-faq-a${i}`}
                  role="region"
                  aria-labelledby={`cr-faq-q${i}`}
                  hidden={!isOpen}
                >
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Final ───────────────────────────── */

function Final({ reduced }: { reduced: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [ref, inView] = useInView<HTMLElement>(0.4);
  const [open, setOpen] = useState(reduced);
  useEffect(() => {
    if (reduced || inView) setOpen(true);
  }, [inView, reduced]);

  return (
    <section className={`cr-final ${open ? "is-open" : ""}`} id="start" ref={ref} aria-labelledby="cr-final-title">
      <div className="cr-final__doors" aria-hidden="true">
        <span className="cr-final__door cr-final__door--l"><em>VORA · SANDBOX</em></span>
        <span className="cr-final__door cr-final__door--r"><em>AUTHORISED WORKLOADS ONLY</em></span>
      </div>
      <div className="cr-final__inner cr-wrap">
        <MarkPrism size={52} />
        <h2 className="cr-final__h" id="cr-final-title">Step inside.</h2>
        <p className="cr-sub">
          Release notes, early builds and the occasional escape-attempt write-up. Nothing else leaves the room.
        </p>
        <form
          className="cr-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label className="cr-sr" htmlFor="cr-email">Email address</label>
          <input
            id="cr-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sent}
          />
          <button className="cr-btn cr-btn--primary" type="submit" disabled={sent}>
            {sent ? "You're on the list ✓" : "Join the list"}
          </button>
        </form>
        <p className="cr-sr" aria-live="polite">{sent ? "You're on the list." : ""}</p>
        <a className="cr-tlink" href={LINKS.github}>
          <GitHubIcon /> Or read the source on GitHub <Arrow />
        </a>
      </div>
    </section>
  );
}

/* ───────────────────────────── Footer ───────────────────────────── */

function Footer() {
  return (
    <footer className="cr-foot">
      <div className="cr-wrap cr-foot__in">
        <a href="#top" className="cr-logo" aria-label="Back to top">
          <MarkPrism size={20} />
          <span>vora</span>
        </a>
        <nav className="cr-foot__links" aria-label="Footer">
          <a href={LINKS.github}>GitHub</a>
          <a href={LINKS.docs}>Docs</a>
          <a href={LINKS.threatModel}>Threat model</a>
          <a href={LINKS.adrs}>ADRs</a>
          <a href={LINKS.examples}>Examples</a>
          <a href={LINKS.probe}>Probe</a>
          <a href="/llms.txt">llms.txt</a>
        </nav>
        <p className="cr-foot__legal">MIT · © {new Date().getFullYear()} Vora</p>
      </div>
    </footer>
  );
}
