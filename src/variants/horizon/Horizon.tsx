import { useEffect, useState } from "react";
import { BlackHole } from "./BlackHole";
import { MarkHorizon } from "../../shared/logos";
import { highlight } from "../../shared/highlight";
import { useCopy, useFonts, useInView, useReducedMotion, useReveal } from "../../shared/hooks";
import {
  AGENT_PROMPT, ATTACKS, AUDIT_LOG, BENCH, CODE, CODE_TABS, FAQ, LIMITS, LINKS,
  PILLARS, PROBE, STATS, STATUS, USE_CASES,
} from "../../shared/content";
import "./horizon.css";

const FONTS_DISPLAY = "https://api.fontshare.com/v2/css?f[]=sentient@1,2&display=swap";
const FONTS_TEXT =
  "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap";

const HOLE = { x: 0.5, y: 0.3, size: 0.105 };

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const LAYERS = [
  { name: "Agent identity", tech: "agent-bound keys · spiffe://vora.sh/…", text: "A leaked workload key exposes one agent — not the tenant, not its siblings." },
  { name: "Control plane", tech: "tenant isolation · scoped keys · mTLS", text: "Another tenant's sandbox reads as “not found”. Runners dial out; nothing dials in." },
  { name: "Network", tech: "default-deny · SNI gateway · allowlist DNS", text: "No interfaces by default. When you open the door, only named hosts answer, and every knock is logged." },
  { name: "Credential broker", tech: "tokens attached upstream, never inside", text: "The token stays in the control plane. The workload only ever sees a broker URL." },
  { name: "Syscall surface", tech: "seccomp · or gVisor's user-space kernel", text: "ptrace, mount, bpf, kexec: refused. On gVisor, syscalls never reach your kernel at all." },
  { name: "Namespaces", tech: "user · pid · mount · net · ipc · uts", text: "Its own processes, its own hostname, its own read-only world. Root inside is nobody outside." },
  { name: "Budgets", tech: "memory · cpu · pids · disk · ttl", text: "Everything it may consume, decided before it starts. Exceed it and it stops, with a reason." },
];

const FORKS = [
  { id: "fork-a", label: "patch A", result: "pytest · 3 failed", ok: false },
  { id: "fork-b", label: "patch B", result: "exit 0 · 214 passed", ok: true },
  { id: "fork-c", label: "patch C", result: "OOMKilled", ok: false },
  { id: "fork-d", label: "patch D", result: "TimeoutExceeded", ok: false },
];

export default function Horizon() {
  useFonts(FONTS_DISPLAY);
  useFonts(FONTS_TEXT);
  const reduced = useReducedMotion();
  const root = useReveal<HTMLDivElement>();
  const { copied, copy } = useCopy();

  useEffect(() => {
    document.title = "Vora — Nothing escapes. Everything is remembered.";
  }, []);

  return (
    <div className="hz" ref={root}>
      <Nav />

      <header className="hz-hero" id="top">
        <BlackHole reduced={reduced} className="hz-hero__sky" anchor={HOLE} />
        <div className="hz-hud hz-hud--tl" aria-hidden="true">
          <span>SBX_01M2NVHE1KRD</span>
          <span>backend gvisor · net none</span>
          <span className="hz-blink">● RUNNING</span>
        </div>
        <div className="hz-hud hz-hud--tr" aria-hidden="true">
          <span>egress 169.254.169.254</span>
          <span className="hz-deny">DENIED</span>
        </div>
        <div className="hz-hud hz-hud--br" aria-hidden="true">
          <span>swallowed this visit</span>
          <strong data-swallowed>0</strong>
        </div>
        <p className="hz-hud hz-hud--bl hz-kicker">
          <em>vorāre</em>
          <span>/woˈraː.re/ · Latin</span>
          <span>to swallow whole</span>
        </p>

        <div className="hz-hero__copy">
          <h1 className="hz-h1">
            Nothing escapes.
            <em>Everything is remembered.</em>
          </h1>
          <p className="hz-lede">
            Vora runs AI agents, generated scripts and strangers' pull requests in sealed Linux sandboxes.
            Nothing crosses the boundary unless you allow it — and every exec, every packet, every decision
            stays on the record.
          </p>
          <div className="hz-ctas">
            <a className="hz-btn hz-btn--primary" href={LINKS.github}>
              Contain your first agent <span aria-hidden="true">→</span>
            </a>
            <button className="hz-btn hz-btn--ghost" onClick={() => copy(AGENT_PROMPT, "prompt")}>
              {copied === "prompt" ? "Prompt copied ✓" : "Copy a prompt for your agent"}
            </button>
          </div>
          <p className="hz-meta">
            <span>{STATUS.version} · {STATUS.stage}</span>
            <span>Open source · {STATUS.license}</span>
            <span>Go · Bubblewrap · gVisor</span>
          </p>
        </div>
        <a href="#fall" className="hz-scroll" aria-label="Scroll">
          <span />
        </a>
      </header>

      <div className="hz-ticker" aria-hidden="true">
        <div className="hz-ticker__track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              default-deny ✦ allowlist-only DNS ✦ SNI egress gateway ✦ gVisor ✦ Bubblewrap ✦ cgroup v2 ✦ seccomp ✦
              secretless credentials ✦ snapshot & fork ✦ OpenTelemetry ✦ MCP ✦ no Kubernetes ✦{" "}
            </span>
          ))}
        </div>
      </div>

      <Fall />
      <Radiation />
      <Anatomy />
      <Timelines />
      <Laws />
      <Code />
      <Probe />
      <Honest />
      <Final />
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={`hz-nav ${scrolled ? "is-scrolled" : ""}`}>
      <a href="#top" className="hz-logo" aria-label="Vora home">
        <MarkHorizon size={26} />
        <span>vora</span>
      </a>
      <div className="hz-nav__links">
        <a href="#fall">The fall</a>
        <a href="#record">The record</a>
        <a href="#anatomy">Anatomy</a>
        <a href="#code">Build</a>
        <a href="#probe">Probe</a>
      </div>
      <a className="hz-nav__gh" href={LINKS.github}>
        <GitHubIcon /> <span>Star</span> <b>{STATUS.version}</b>
      </a>
    </nav>
  );
}

function Fall() {
  const [active, setActive] = useState(0);
  const [ref, inView] = useInView<HTMLElement>(0.35);
  const [auto, setAuto] = useState(true);
  const attack = ATTACKS[active];

  useEffect(() => {
    if (!inView || !auto) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % ATTACKS.length), 3800);
    return () => window.clearInterval(id);
  }, [inView, auto]);

  return (
    <section className="hz-sec hz-fall" id="fall" ref={ref}>
      <div className="hz-sec__head" data-reveal>
        <p className="hz-eyebrow">01 — The fall</p>
        <h2 className="hz-h2">
          Throw anything at it. <em>Watch it disappear.</em>
        </h2>
        <p className="hz-sub">
          Vora assumes every workload is actively malicious. These are real commands and the real answers a
          sandbox gives back.
        </p>
      </div>
      <div className="hz-fall__grid" data-reveal>
        <ol className="hz-fall__list">
          {ATTACKS.map((a, i) => (
            <li key={a.id}>
              <button
                className={i === active ? "is-active" : ""}
                onClick={() => {
                  setActive(i);
                  setAuto(false);
                }}
              >
                <span className="hz-fall__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="hz-fall__name">{a.name}</span>
                <span className="hz-fall__verdict">{a.verdict}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="hz-term" key={attack.id}>
          <div className="hz-term__bar">
            <span>sbx_01M2…EW3</span>
            <span>{attack.boundary}</span>
          </div>
          <pre className="hz-term__body">
            <span className="hz-term__intent"># {attack.intent}</span>
            {"\n"}
            <span className="hz-term__cmd">
              <span className="tk-prompt">$ </span>vora exec sbx_01M2… -- {attack.command}
            </span>
            {"\n"}
            {attack.output.map((line, i) => (
              <span key={i} className="hz-term__out" style={{ animationDelay: `${0.5 + i * 0.35}s` }}>
                {line}
                {"\n"}
              </span>
            ))}
          </pre>
          <div className="hz-term__stamp">{attack.verdict}</div>
          <div className="hz-term__foot">host unaffected · recorded to audit trail</div>
        </div>
      </div>
    </section>
  );
}

function Radiation() {
  const [ref, inView] = useInView<HTMLElement>(0.3);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    setCount(0);
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setCount(i);
      if (i >= AUDIT_LOG.length) window.clearInterval(id);
    }, 420);
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <section className="hz-sec hz-rad" id="record" ref={ref}>
      <div className="hz-rad__copy" data-reveal>
        <p className="hz-eyebrow">02 — Hawking radiation</p>
        <h2 className="hz-h2">
          Black holes leak.
          <em>Ours leaks one thing: the truth.</em>
        </h2>
        <p className="hz-sub">
          A flight recorder for every agent. Lifecycle transitions, every execution, every allowed and denied
          connection — attributed to an agent and the key it used. If an allow can't be written down, it
          doesn't happen.
        </p>
        <ul className="hz-rad__facts">
          <li><b>Fail-closed</b> unaudited allows are refused</li>
          <li><b>JSONL or Postgres</b> your store, your retention</li>
          <li><b>OpenTelemetry</b> API → runner → runtime traces</li>
        </ul>
      </div>
      <div className="hz-log" data-reveal>
        <div className="hz-log__bar">
          <span>$ vora logs sbx_01M2… --egress --execs</span>
          <span className="hz-blink">● live</span>
        </div>
        <ul>
          {AUDIT_LOG.slice(0, count).map((row) => (
            <li key={row.t} className={`hz-log__row is-${row.kind} ${/denied|NXDOMAIN/.test(row.text) ? "is-bad" : ""}`}>
              <time>{row.t}</time>
              <span className="hz-log__kind">{row.kind}</span>
              <span className="hz-log__text">{row.text}</span>
              <span className="hz-log__actor">{row.actor}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Anatomy() {
  const [sel, setSel] = useState(2);
  const layer = LAYERS[sel];
  const size = 520;
  const c = size / 2;
  return (
    <section className="hz-sec hz-anat" id="anatomy">
      <div className="hz-sec__head" data-reveal>
        <p className="hz-eyebrow">03 — Anatomy of a horizon</p>
        <h2 className="hz-h2">
          Seven boundaries <em>between it and you.</em>
        </h2>
      </div>
      <div className="hz-anat__grid" data-reveal>
        <svg className="hz-anat__svg" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Concentric isolation layers">
          <defs>
            <radialGradient id="hz-core" cx="50%" cy="50%" r="50%">
              <stop offset="0.72" stopColor="#000" />
              <stop offset="0.86" stopColor="#ff7a2e" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ff7a2e" stopOpacity="0" />
            </radialGradient>
          </defs>
          {LAYERS.map((l, i) => {
            const r = 244 - i * 29;
            const on = i === sel;
            return (
              <g key={l.name} className={`hz-orbit ${on ? "is-on" : ""}`} onMouseEnter={() => setSel(i)} onClick={() => setSel(i)}>
                <circle cx={c} cy={c} r={r} className="hz-orbit__hit" />
                <circle
                  cx={c}
                  cy={c}
                  r={r}
                  className="hz-orbit__line"
                  style={{ animationDuration: `${40 + i * 14}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
                />
                <circle cx={c + r} cy={c} r={on ? 5 : 3} className="hz-orbit__dot" style={{ transformOrigin: `${c}px ${c}px`, animationDuration: `${18 + i * 7}s` }} />
              </g>
            );
          })}
          <circle cx={c} cy={c} r="44" fill="url(#hz-core)" />
          <text x={c} y={c + 4} textAnchor="middle" className="hz-anat__core">your agent</text>
        </svg>
        <div className="hz-anat__info">
          <ol className="hz-anat__list">
            {LAYERS.map((l, i) => (
              <li key={l.name}>
                <button className={i === sel ? "is-on" : ""} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)}>
                  <span>{String(7 - i).padStart(2, "0")}</span> {l.name}
                </button>
              </li>
            ))}
          </ol>
          <div className="hz-anat__card" key={sel}>
            <p className="hz-anat__tech">{layer.tech}</p>
            <p className="hz-anat__text">{layer.text}</p>
          </div>
          <a className="hz-link" href={LINKS.threatModel}>Read the threat model →</a>
        </div>
      </div>
    </section>
  );
}

function Timelines() {
  const [ref, inView] = useInView<HTMLElement>(0.4);
  return (
    <section className={`hz-sec hz-time ${inView ? "is-live" : ""}`} ref={ref}>
      <div className="hz-sec__head" data-reveal>
        <p className="hz-eyebrow">04 — Parallel timelines</p>
        <h2 className="hz-h2">
          Fork reality. <em>Keep the timeline that passes.</em>
        </h2>
        <p className="hz-sub">
          Snapshot a running sandbox, fork it N ways, let your agents race from the exact same state. Forks
          never see each other's writes.
        </p>
      </div>
      <div className="hz-time__stage" data-reveal>
        <svg viewBox="0 0 900 340" className="hz-time__svg" aria-hidden="true">
          <line x1="40" y1="170" x2="250" y2="170" className="hz-time__trunk" />
          {FORKS.map((f, i) => {
            const y = 50 + i * 80;
            return (
              <path
                key={f.id}
                d={`M250 170 C 380 170, 400 ${y}, 560 ${y} L 700 ${y}`}
                className={`hz-time__branch ${f.ok ? "is-ok" : ""}`}
                style={{ animationDelay: `${0.3 + i * 0.18}s` }}
              />
            );
          })}
          <circle cx="250" cy="170" r="9" className="hz-time__snap" />
        </svg>
        <div className="hz-time__labels">
          <div className="hz-time__src">
            <span>sbx_01M2…</span>
            <b>snap_01M2PE4G</b>
          </div>
          {FORKS.map((f, i) => (
            <div key={f.id} className={`hz-time__res ${f.ok ? "is-ok" : ""}`} style={{ top: `${((50 + i * 80) / 340) * 100}%`, transitionDelay: `${1 + i * 0.18}s` }}>
              <span>{f.label}</span>
              <b>{f.result}</b>
            </div>
          ))}
        </div>
      </div>
      <pre className="hz-time__cmd" data-reveal>
        {highlight(`$ vora snapshot create sbx_01M2…\nSnapshot created: snap_01M2PE4G… (18432 bytes)\n$ vora snapshot fork snap_01M2PE4G…\nSandbox forked: sbx_01M2PF2K…`)}
      </pre>
    </section>
  );
}

function Laws() {
  return (
    <section className="hz-sec hz-laws">
      <div className="hz-sec__head" data-reveal>
        <p className="hz-eyebrow">05 — The laws</p>
        <h2 className="hz-h2">
          Physics, <em>not policy docs.</em>
        </h2>
      </div>
      <div className="hz-laws__grid">
        {PILLARS.map((p, i) => (
          <article key={p.key} className="hz-law" data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
            <span className="hz-law__n">{ROMAN[i]}</span>
            <h3>{p.title}</h3>
            <p className="hz-law__line">{p.line}</p>
            <p className="hz-law__detail">{p.detail}</p>
            <code>{p.proof}</code>
          </article>
        ))}
      </div>
      <div className="hz-uses" data-reveal>
        <p className="hz-eyebrow">Things people feed it</p>
        <ul>
          {USE_CASES.map((u) => (
            <li key={u.title}>
              <b>{u.title}</b>
              <span>{u.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Code() {
  const [tab, setTab] = useState<(typeof CODE_TABS)[number]["key"]>("typescript");
  const { copied, copy } = useCopy();
  const [bench, setBench] = useState(false);
  return (
    <section className="hz-sec hz-code" id="code">
      <div className="hz-sec__head" data-reveal>
        <p className="hz-eyebrow">06 — Build</p>
        <h2 className="hz-h2">
          Twelve lines <em>to the event horizon.</em>
        </h2>
      </div>
      <div className="hz-code__grid" data-reveal>
        <div className="hz-panel">
          <div className="hz-panel__tabs" role="tablist">
            {CODE_TABS.map((t) => (
              <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? "is-on" : ""} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
            <button className="hz-panel__copy" onClick={() => copy(CODE[tab], tab)}>
              {copied === tab ? "copied ✓" : "copy"}
            </button>
          </div>
          <pre className="hz-panel__code">{highlight(CODE[tab])}</pre>
        </div>
        <div className="hz-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hz-stat">
              <p className="hz-stat__v">
                {s.value}
                <small>{s.unit}</small>
              </p>
              <p className="hz-stat__l">{s.label}</p>
              <p className="hz-stat__n">{s.note}</p>
            </div>
          ))}
          <button className="hz-link hz-stats__bench" onClick={() => setBench((b) => !b)} aria-expanded={bench}>
            {bench ? "Hide" : "Show"} the raw benchmark {bench ? "↑" : "↓"}
          </button>
          {bench && (
            <div className="hz-bench">
              <p>{BENCH.host}</p>
              <dl>
                {BENCH.rows.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Probe() {
  return (
    <section className="hz-sec hz-probe" id="probe">
      <div className="hz-probe__card" data-reveal>
        <div className="hz-probe__head">
          <p className="hz-eyebrow">07 — First expedition</p>
          <h2 className="hz-h2">
            {PROBE.name}. <em>{PROBE.tagline}</em>
          </h2>
          <p className="hz-sub">{PROBE.description}</p>
        </div>
        <div className="hz-probe__refusals">
          {PROBE.refusals.map((r) => (
            <div key={r.title} className="hz-refusal">
              <span className="hz-refusal__x" aria-hidden="true">⊘</span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
        <div className="hz-probe__foot">
          <blockquote>“{PROBE.finding}”</blockquote>
          <pre>{highlight(`$ ${PROBE.command}`)}</pre>
          <a className="hz-link" href={LINKS.probe}>Explore Probe →</a>
        </div>
      </div>
    </section>
  );
}

function Honest() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="hz-sec hz-honest">
      <div className="hz-honest__grid">
        <div data-reveal>
          <p className="hz-eyebrow">08 — Known unknowns</p>
          <h2 className="hz-h2">
            {STATUS.version}. <em>Said out loud.</em>
          </h2>
          <ul className="hz-limits">
            {LIMITS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="hz-next">Next on the horizon: {STATUS.next}</p>
        </div>
        <div className="hz-faq" data-reveal>
          {FAQ.map((f, i) => (
            <div key={f.q} className={`hz-faq__item ${open === i ? "is-open" : ""}`}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                {f.q}
                <span aria-hidden="true">{open === i ? "−" : "+"}</span>
              </button>
              <div className="hz-faq__a">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Final() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="hz-final" id="start">
      <div className="hz-final__glow" aria-hidden="true" />
      <div className="hz-final__inner" data-reveal>
        <MarkHorizon size={56} />
        <h2 className="hz-final__h">
          Cross the <em>horizon.</em>
        </h2>
        <p className="hz-sub">Early builds, release notes and the occasional escape attempt write-up. No spam escapes either.</p>
        <form
          className="hz-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input type="email" required placeholder="you@company.dev" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
          <button className="hz-btn hz-btn--primary" type="submit" disabled={sent}>
            {sent ? "You're on the record ✓" : "Request early access"}
          </button>
        </form>
        <a className="hz-link" href={LINKS.github}>or read the source on GitHub →</a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="hz-foot">
      <div className="hz-logo">
        <MarkHorizon size={20} />
        <span>vora</span>
      </div>
      <nav>
        <a href={LINKS.github}>GitHub</a>
        <a href={LINKS.docs}>Docs</a>
        <a href={LINKS.threatModel}>Threat model</a>
        <a href={LINKS.adrs}>ADRs</a>
        <a href={LINKS.probe}>Probe</a>
        <a href="/llms.txt">llms.txt</a>
      </nav>
      <p>MIT · © {new Date().getFullYear()} Vora</p>
    </footer>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}
