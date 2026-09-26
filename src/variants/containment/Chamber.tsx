import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ATTACKS, type Attack } from "../../shared/content";
import { useInView } from "../../shared/hooks";
import { Crops } from "./ui";

const SBX = "sbx_01M2…";

// Where each specimen hits the wall (percent of the cell) and which class it belongs to.
const META: Record<string, { x: number; y: number; cls: string }> = {
  metadata: { x: 100, y: 30, cls: "credential theft" },
  forkbomb: { x: 46, y: 0, cls: "resource exhaustion" },
  membomb: { x: 34, y: 100, cls: "resource exhaustion" },
  rootfs: { x: 0, y: 62, cls: "tampering" },
  secrets: { x: 80, y: 0, cls: "exfiltration" },
  dns: { x: 100, y: 74, cls: "exfiltration" },
};

const CRACKS = [
  "M80 80 L91 71 L100 74 L112 60 L126 57 L140 44",
  "M80 80 L71 66 L74 54 L65 41 L67 28",
  "M80 80 L66 87 L55 85 L43 96 L28 97",
  "M80 80 L87 95 L83 108 L94 121 L92 136",
  "M80 80 L97 89 L109 87 L121 96",
  "M80 80 L69 75 L58 62 L46 60",
];

const SEGMENTS = 24;

type Phase = "idle" | "typing" | "output" | "verdict";
type Row = { n: number; t: string; a: Attack };

export const sid = (i: number) => `S-${String(i + 1).padStart(2, "0")}`;

function clock(d = new Date()) {
  const p = (x: number, l = 2) => String(x).padStart(l, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
}

export function Chamber({ reduced }: { reduced: boolean }) {
  const [ref, inView] = useInView<HTMLElement>(0.2);
  const [auto, setAuto] = useState(true);
  const [run, setRun] = useState<{ i: number; n: number } | null>(null);
  const [typed, setTyped] = useState(0);
  const [lines, setLines] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<Row[]>([]);
  const [said, setSaid] = useState("");
  const autoRef = useRef(auto);
  autoRef.current = auto;

  const inject = (i: number) => {
    setAuto(false);
    setRun((r) => ({ i, n: (r?.n ?? 0) + 1 }));
  };

  // Cross-links elsewhere on the page ("test it in the chamber") dispatch this.
  useEffect(() => {
    const on = (e: Event) => {
      const i = ATTACKS.findIndex((a) => a.id === (e as CustomEvent<string>).detail);
      if (i >= 0) inject(i);
    };
    window.addEventListener("cp-inject", on);
    return () => window.removeEventListener("cp-inject", on);
  }, []);

  // Auto-cycle: first specimen ~1s after load, then one every ~5s, only while visible.
  useEffect(() => {
    if (!auto || !inView) return;
    const id = window.setTimeout(
      () => setRun((r) => ({ i: r ? (r.i + 1) % ATTACKS.length : 0, n: (r?.n ?? 0) + 1 })),
      run ? 5200 : 1000,
    );
    return () => window.clearTimeout(id);
  }, [auto, inView, run]);

  useEffect(() => {
    if (!run) return;
    const a = ATTACKS[run.i];
    const full = `vora exec ${SBX} -- ${a.command}`;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const finish = () => {
      setPhase("verdict");
      setLog((l) => (l[0]?.n === run.n ? l : [{ n: run.n, t: clock(), a }, ...l].slice(0, 4)));
      if (!autoRef.current) setSaid(`${a.name}: ${a.verdict}. Stopped at ${a.boundary}. Host integrity 100 percent.`);
    };

    if (reduced) {
      setTyped(full.length);
      setLines(a.output.length);
      finish();
      // Reduced motion: show the first specimen, then hold still unless re-enabled.
      if (run.n === 1) setAuto(false);
      return;
    }

    setPhase("typing");
    setTyped(0);
    setLines(0);
    const per = Math.max(1, Math.ceil(full.length / 48));
    let c = 0;
    const iv = window.setInterval(() => {
      c = Math.min(full.length, c + per);
      setTyped(c);
      if (c >= full.length) {
        window.clearInterval(iv);
        later(() => setPhase("output"), 120);
        a.output.forEach((_, k) => later(() => setLines(k + 1), 160 + k * 280));
        later(finish, 360 + a.output.length * 280);
      }
    }, 20);
    return () => {
      window.clearInterval(iv);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [run, reduced]);

  const attack = run ? ATTACKS[run.i] : null;
  const meta = attack ? META[attack.id] : null;
  const cmd = attack ? `vora exec ${SBX} -- ${attack.command}` : "";
  const hit = phase === "output" || phase === "verdict";
  const impactStyle: CSSProperties | undefined = meta
    ? {
        left: `calc(${meta.x}% + ${meta.x === 0 ? 7 : meta.x === 100 ? -7 : 0}px)`,
        top: `calc(${meta.y}% + ${meta.y === 0 ? 7 : meta.y === 100 ? -7 : 0}px)`,
      }
    : undefined;
  const attempts = log.length ? log[0].n : 0;

  return (
    <section className="cp-chamber" ref={ref} id="chamber" tabIndex={-1} aria-labelledby="cp-chamber-title">
      <Crops />
      <div className="cp-chamber__head">
        <h2 className="cp-chamber__title" id="cp-chamber-title">
          <span className="cp-chamber__no">Chamber 01</span>
          <span>{SBX}EW3</span>
        </h2>
        <span className="cp-chamber__tag">backend gvisor</span>
        <span className="cp-chamber__tag">net none</span>
        <span className="cp-chamber__led">
          <i aria-hidden="true" /> Sealed
        </span>
      </div>

      <div className="cp-cellwrap">
        <div className="cp-dim cp-dim--top" aria-hidden="true">
          <span>mem 512Mi · cpu 1 · pids 128 · ttl 10m</span>
        </div>
        <div className="cp-cellrow">
          <div className={`cp-cell ${phase === "output" ? "is-hit" : ""}`}>
            <div className="cp-cell__glass">
              <p className="cp-cell__spec" aria-hidden="true">
                {attack && meta ? (
                  <>
                    <b>Specimen {sid(run!.i)}</b> <span>class: {meta.cls}</span>
                  </>
                ) : (
                  <>
                    <b>Specimen —</b> <span>awaiting injection</span>
                  </>
                )}
              </p>
              <pre className="cp-term">
                {attack ? (
                  <>
                    <span className="cp-term__com"># intent: {attack.intent.toLowerCase()}</span>
                    {"\n"}
                    <span className="tk-prompt">$ </span>
                    <span className="cp-term__cmd">{cmd.slice(0, typed)}</span>
                    {phase === "typing" && <span className="cp-caret" aria-hidden="true" />}
                    {"\n"}
                    {attack.output.slice(0, lines).map((l, k) => (
                      <span key={k} className={`cp-term__out ${/^reason:|BLOCKED|NXDOMAIN|^Killed/.test(l) ? "is-bad" : ""}`}>
                        {l}
                        {"\n"}
                      </span>
                    ))}
                    {phase === "verdict" && <span className="cp-term__ok">✓ host unaffected · written to the audit trail</span>}
                  </>
                ) : (
                  <>
                    <span className="cp-term__com"># chamber sealed · default deny · awaiting specimen</span>
                    {"\n"}
                    <span className="tk-prompt">$ </span>
                    <span className="cp-caret" aria-hidden="true" />
                  </>
                )}
              </pre>
              {phase === "verdict" && attack && (
                <div className="cp-stamp-wrap" key={`s${run!.n}`} aria-hidden="true">
                  <div className={`cp-bigstamp ${attack.verdict.length > 9 ? "is-long" : ""}`}>
                    <b>{attack.verdict}</b>
                    <span>{attack.boundary}</span>
                  </div>
                </div>
              )}
            </div>
            {hit && meta && (
              <div className="cp-cell__flash" key={`f${run!.n}`} style={{ "--x": `${meta.x}%`, "--y": `${meta.y}%` } as CSSProperties} aria-hidden="true" />
            )}
            {hit && meta && (
              <svg className="cp-impact" key={`i${run!.n}`} style={impactStyle} viewBox="0 0 160 160" aria-hidden="true">
                <circle className="cp-impact__ring" cx="80" cy="80" r="10" />
                <circle className="cp-impact__ring cp-impact__ring--2" cx="80" cy="80" r="10" />
                {CRACKS.map((d, k) => (
                  <path key={k} d={d} className="cp-impact__crack" style={{ animationDelay: `${k * 30}ms` }} />
                ))}
                <circle className="cp-impact__core" cx="80" cy="80" r="4" />
              </svg>
            )}
          </div>
          <div className="cp-dim cp-dim--side" aria-hidden="true">
            <span>egress: deny</span>
          </div>
        </div>
      </div>

      <div className={`cp-integrity ${phase === "output" ? "is-hit" : ""}`}>
        <div className="cp-integrity__meter" role="meter" aria-label="Host integrity" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100}>
          <span className="cp-integrity__label">Host integrity</span>
          <span className="cp-integrity__bar" aria-hidden="true">
            {Array.from({ length: SEGMENTS }).map((_, k) => (
              <i key={k} style={{ animationDelay: `${(k % 6) * 40}ms` }} />
            ))}
          </span>
          <b className="cp-integrity__val">100%</b>
        </div>
        <dl className="cp-integrity__counts">
          <div>
            <dt>Attempts</dt>
            <dd>{String(attempts).padStart(2, "0")}</dd>
          </div>
          <div>
            <dt>Escapes</dt>
            <dd className="is-zero">00</dd>
          </div>
        </dl>
      </div>

      <div className="cp-inject">
        <div className="cp-inject__head">
          <p id="cp-inject-label">Inject a specimen</p>
          <button className={`cp-auto ${auto ? "is-on" : ""}`} aria-pressed={auto} onClick={() => setAuto((v) => !v)}>
            <i aria-hidden="true" /> Auto-cycle {auto ? "on" : "off"}
          </button>
        </div>
        <div className="cp-inject__grid" role="group" aria-labelledby="cp-inject-label">
          {ATTACKS.map((a, i) => (
            <button
              key={a.id}
              className={`cp-inject__btn ${run?.i === i ? "is-active" : ""}`}
              aria-pressed={run?.i === i}
              onClick={() => inject(i)}
            >
              <span className="cp-inject__k">
                Inject · {sid(i)}
              </span>
              <span className="cp-inject__n">{a.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cp-coc">
        <p className="cp-coc__title">
          <span>Chain of custody</span>
          <span>{SBX} · live</span>
        </p>
        <table className="cp-coc__table">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Specimen</th>
              <th scope="col">Verdict</th>
              <th scope="col" className="cp-coc__b">Boundary</th>
            </tr>
          </thead>
          <tbody>
            {log.length === 0 && (
              <tr className="cp-coc__empty">
                <td colSpan={4}>— no specimens logged yet —</td>
              </tr>
            )}
            {log.map((r) => (
              <tr key={r.n}>
                <td>{r.t}</td>
                <td>
                  {sid(ATTACKS.indexOf(r.a))} <span className="cp-coc__id">{r.a.id}</span>
                </td>
                <td className="cp-coc__v">{r.a.verdict}</td>
                <td className="cp-coc__b">{r.a.boundary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="cp-sr" role="status" aria-live="polite">
        {said}
      </p>
    </section>
  );
}
