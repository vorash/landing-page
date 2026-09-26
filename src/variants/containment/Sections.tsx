import { useEffect, useState, type CSSProperties } from "react";
import { highlight } from "../../shared/highlight";
import { useInView } from "../../shared/hooks";
import { AUDIT_LOG, PILLARS, STATUS } from "../../shared/content";
import { Barcode, Crops, Picto, Plate } from "./ui";

/* ── §03 Protocol ─────────────────────────────────────────────── */

const STEPS = [
  {
    n: "01",
    verb: "Seal",
    text: "Create the chamber with its budgets and network mode decided up front. Nothing is inherited from the host.",
    code: "$ vora sandbox create \\\n    --image vora/python \\\n    --memory 512m --cpu 1 \\\n    --pids 128 --network none\nSandbox created: sbx_01M2NVHE1KRD8JT3D6QG6R0EW3",
    check: "budgets set · net none",
  },
  {
    n: "02",
    verb: "Expose",
    text: "Introduce the specimen. Write untrusted code into /workspace and exec it behind every layer, on a read-only rootfs.",
    code: `$ vora exec sbx_01M2… -- python3 -c 'print("hello from vora")'\nhello from vora`,
    check: "exec on the record",
  },
  {
    n: "03",
    verb: "Observe",
    text: "Read the flight recorder: lifecycle transitions, every exec, every allowed and denied connection, and live resource stats.",
    code: "$ vora logs sbx_01M2… --egress\nallowed  pypi.org:443\ndenied   169.254.169.254:80\n$ vora stats sbx_01M2…",
    check: "egress attributed",
  },
  {
    n: "04",
    verb: "Decontaminate",
    text: "Destroy it when the job is done — or let the TTL reaper do it for you when the clock runs out.",
    code: "$ vora sandbox destroy sbx_01M2…\n# or let --ttl expire:\nRUNNING -> STOPPED  (TimeoutExceeded)",
    check: "ttl reaper armed",
  },
];

export function Protocol() {
  const [ref, inView] = useInView<HTMLOListElement>(0.25);
  return (
    <section className="cp-sec cp-protocol" id="protocol" tabIndex={-1} aria-labelledby="cp-protocol-h">
      <div className="cp-wrap">
        <Plate
          n="03"
          label="Protocol"
          code="SOP VR-07 · REV 0.7"
          id="cp-protocol-h"
          title={
            <>
              Four steps. <span className="cp-dim-text">No exceptions.</span>
            </>
          }
          sub="Standard operating procedure for running code you don't trust. One Go binary on any Linux box — no Kubernetes, no KVM."
        />
        <ol className={`cp-steps ${inView ? "is-live" : ""}`} ref={ref}>
          {STEPS.map((s, i) => (
            <li key={s.n} className="cp-step" data-reveal style={{ "--i": i, transitionDelay: `${i * 90}ms` } as CSSProperties}>
              <div className="cp-step__rail" aria-hidden="true" />
              <p className="cp-step__n">
                <span>Step</span> {s.n}
              </p>
              <h3 className="cp-step__verb">{s.verb}</h3>
              <p className="cp-step__text">{s.text}</p>
              <pre className="cp-code cp-step__code">{highlight(s.code)}</pre>
              <p className="cp-step__check">
                <span className="cp-step__box" aria-hidden="true" />
                <span>{s.check}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── §04 Measures (pillars as specimen labels) ───────────────── */

const CLASS: Record<string, string> = {
  network: "NET",
  audit: "REC",
  identity: "IDN",
  isolation: "ISO",
  secrets: "KEY",
  fork: "FRK",
  budgets: "BGT",
  agents: "MCP",
};

export function Measures() {
  return (
    <section className="cp-sec cp-measures" id="measures" tabIndex={-1} aria-labelledby="cp-measures-h">
      <div className="cp-wrap">
        <Plate
          n="04"
          label="Containment measures"
          code="REGISTER CTN-001 → CTN-008"
          id="cp-measures-h"
          title={
            <>
              Read the label <span className="cp-dim-text">before you open it.</span>
            </>
          }
          sub="Eight measures ship on every chamber. Each label carries the test or the command you can run to check it yourself."
        />
        <div className="cp-labels">
          {PILLARS.map((p, i) => {
            const id = `CTN-${String(i + 1).padStart(3, "0")}`;
            return (
              <article key={p.key} className="cp-label" data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                <header className="cp-label__top">
                  <span className="cp-label__id">{id}</span>
                  <span className="cp-label__cls">Class {CLASS[p.key]}</span>
                </header>
                <div className="cp-label__body">
                  <div className="cp-label__row">
                    <h3 className="cp-label__title">{p.title}</h3>
                    <Picto kind={p.key} />
                  </div>
                  <p className="cp-label__line">{p.line}</p>
                  <p className="cp-label__detail">{p.detail}</p>
                </div>
                <p className="cp-label__test">
                  <b>Test:</b> <code>{p.proof}</code>
                </p>
                <footer className="cp-label__foot">
                  <Barcode seed={p.key} length={120} />
                  <span>
                    VR-07 · LOT {STATUS.version}
                    <br />
                    {STATUS.license} · handle as hostile
                  </span>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── §05 Chain of custody ────────────────────────────────────── */

const isBad = (text: string) => /denied|NXDOMAIN/.test(text);

export function Custody({ reduced }: { reduced: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [count, setCount] = useState(0);
  const total = AUDIT_LOG.length;
  const denied = AUDIT_LOG.filter((r) => isBad(r.text)).length;

  useEffect(() => {
    if (!inView || count >= total) return;
    if (reduced) {
      setCount(total);
      return;
    }
    const id = window.setTimeout(() => setCount((c) => c + 1), count === 0 ? 200 : 380);
    return () => window.clearTimeout(id);
  }, [inView, count, total, reduced]);

  return (
    <section className="cp-sec cp-custody" id="custody" tabIndex={-1} aria-labelledby="cp-custody-h">
      <div className="cp-wrap cp-custody__grid">
        <div className="cp-custody__copy">
          <Plate
            n="05"
            label="Chain of custody"
            code="LEDGER · FLIGHT RECORDER"
            id="cp-custody-h"
            title={
              <>
                Nothing leaves <span className="cp-dim-text">unrecorded.</span>
              </>
            }
            sub="Every lifecycle event, every exec and every egress decision — allowed or denied — attributed to an agent and the key it used."
          />
          <ul className="cp-facts" data-reveal>
            <li>
              <b>Fail closed</b>
              <span>An allow that can't be audited doesn't happen.</span>
            </li>
            <li>
              <b>Your store</b>
              <span>JSONL or Postgres, your retention.</span>
            </li>
            <li>
              <b>Traced</b>
              <span>OpenTelemetry traces and Prometheus metrics.</span>
            </li>
            <li>
              <b>Attributed</b>
              <span>Which agent, on whose key — every record.</span>
            </li>
          </ul>
        </div>

        <div className="cp-ledger" ref={ref} data-reveal>
          <Crops />
          <div className="cp-ledger__head">
            <span>
              <b>Ledger</b> · sbx_01M2… · $ vora logs --egress
            </span>
            <span className="cp-ledger__rec">
              <i aria-hidden="true" /> REC
            </span>
          </div>
          <div className="cp-scroll" tabIndex={0} role="region" aria-label="Audit ledger (scrolls horizontally)">
            <table className="cp-ledger__table">
              <thead>
                <tr>
                  <th scope="col">№</th>
                  <th scope="col">Time</th>
                  <th scope="col">Kind</th>
                  <th scope="col">Event</th>
                  <th scope="col">Actor</th>
                </tr>
              </thead>
              <tbody>
                {AUDIT_LOG.map((r, i) => (
                  <tr key={r.t} className={`${i < count ? "is-on" : ""} ${isBad(r.text) ? "is-bad" : ""}`}>
                    <td className="cp-ledger__n">{String(i + 1).padStart(4, "0")}</td>
                    <td>{r.t}</td>
                    <td>
                      <span className={`cp-kind cp-kind--${r.kind}`}>{r.kind}</span>
                    </td>
                    <td className="cp-ledger__ev">
                      {isBad(r.text) && <span aria-hidden="true">⚠ </span>}
                      {r.text}
                    </td>
                    <td className="cp-ledger__actor">{r.actor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`cp-ledger__end ${count >= total ? "is-on" : ""}`}>
            — End of record · {total} entries · {denied} denied —
          </p>
          <div className={`cp-ledger__stamp ${count >= total ? "is-on" : ""}`} aria-hidden="true">
            On the record
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── §06 Clone the specimen ──────────────────────────────────── */

const FORKS = [
  { id: "A", result: "pytest · 3 failed", ok: false },
  { id: "B", result: "OOMKilled", ok: false },
  { id: "C", result: "exit 0 · 214 passed", ok: true },
  { id: "D", result: "TimeoutExceeded", ok: false },
];

export function Clone() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  return (
    <section className="cp-sec cp-clone" id="clone" tabIndex={-1} aria-labelledby="cp-clone-h">
      <div className="cp-wrap cp-clone__grid">
        <div className="cp-clone__copy">
          <Plate
            n="06"
            label="Snapshot & fork"
            code="CULTURE · 1 → N"
            id="cp-clone-h"
            title={
              <>
                Clone <span className="cp-dim-text">the specimen.</span>
              </>
            }
            sub="Capture a running sandbox live, then fork independent copies from that exact state. Fan out N candidate patches from one repo and keep the one that passes."
          />
          <pre className="cp-code cp-clone__cli" data-reveal>
            {highlight(
              "$ vora snapshot create sbx_01M2…\nSnapshot created: snap_01M2PE4G… (18432 bytes)\n$ vora snapshot fork snap_01M2PE4G…\nSandbox forked: sbx_01M2PF2K…",
            )}
          </pre>
        </div>

        <div data-reveal>
        <div className={`cp-tree ${inView ? "is-live" : ""}`} ref={ref}>
          <Crops />
          <p className="cp-tree__head">
            <span>Culture plate · snap_01M2PE4G…</span>
            <span>4 forks · isolated writes</span>
          </p>
          <ol className="cp-tree__lines" aria-label="Four forks from one snapshot">
            <li className="cp-tree__line" style={{ "--d": 0 } as CSSProperties}>
              <span className="cp-tree__g" aria-hidden="true">
                ■
              </span>
              <span className="cp-tree__src">sbx_01M2…</span>
              <span className="cp-tree__meta">running · repo @ HEAD</span>
            </li>
            <li className="cp-tree__line" style={{ "--d": 1 } as CSSProperties}>
              <span className="cp-tree__g" aria-hidden="true">
                ●
              </span>
              <span className="cp-tree__src">snap_01M2PE4G…</span>
              <span className="cp-tree__meta">18432 bytes</span>
            </li>
            {FORKS.map((f, i) => (
              <li
                key={f.id}
                className={`cp-tree__line cp-tree__fork ${f.ok ? "is-ok" : "is-bad"}`}
                style={{ "--d": i + 2 } as CSSProperties}
              >
                <span className="cp-tree__g" aria-hidden="true">
                  ▶
                </span>
                <span className="cp-tree__src">fork {f.id} · patch {f.id}</span>
                <span className="cp-tree__res">{f.result}</span>
                <span className="cp-tree__tag">{f.ok ? "✓ retain" : "✗ discard"}</span>
              </li>
            ))}
          </ol>
          <p className="cp-tree__foot">Forks never see each other's writes.</p>
        </div>
        </div>
      </div>
    </section>
  );
}
