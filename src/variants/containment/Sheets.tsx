import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { highlight } from "../../shared/highlight";
import { useCopy } from "../../shared/hooks";
import { MarkCell } from "../../shared/logos";
import {
  BENCH, CODE, CODE_TABS, FAQ, LIMITS, LINKS, PROBE, STATS, STATUS, USE_CASES,
} from "../../shared/content";
import { Barcode, Crops, GitHubIcon, Plate } from "./ui";

/* ── §07 Datasheet ───────────────────────────────────────────── */

type TabKey = (typeof CODE_TABS)[number]["key"];

export function Datasheet() {
  const [tab, setTab] = useState<TabKey>("cli");
  const { copied, copy } = useCopy();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = CODE_TABS.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setTab(CODE_TABS[next].key);
    tabs.current[next]?.focus();
  };

  return (
    <section className="cp-sec cp-data" id="datasheet" tabIndex={-1} aria-labelledby="cp-data-h">
      <div className="cp-wrap">
        <Plate
          n="07"
          label="Datasheet"
          code={`VORA RUNTIME · REV ${STATUS.version}`}
          id="cp-data-h"
          title={
            <>
              Measured, <span className="cp-dim-text">not promised.</span>
            </>
          }
          sub="Numbers from the repository's own benchmarks, published with the host they ran on."
        />

        <dl className="cp-readouts" data-reveal>
          {STATS.map((s, i) => (
            <div key={s.label} className="cp-readout">
              <dt className="cp-readout__k">
                <span>R-{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </dt>
              <dd className="cp-readout__v">
                {s.value}
                {s.unit && <small>{s.unit}</small>}
              </dd>
              <dd className="cp-readout__n">{s.note}</dd>
            </div>
          ))}
        </dl>

        <div className="cp-data__grid">
          <div className="cp-bench" data-reveal>
            <p className="cp-bench__head">
              <span>Test conditions</span>
              <span>{BENCH.host}</span>
            </p>
            <dl className="cp-bench__rows">
              {BENCH.rows.map((r) => (
                <div key={r.k}>
                  <dt>{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </dl>
            <p className="cp-bench__note">
              The 1.1 s cold create is real. Exec latency and density are what your agent loop feels.
            </p>
          </div>

          <div className="cp-panel" data-reveal>
            <div className="cp-panel__bar">
              <div className="cp-panel__tabs" role="tablist" aria-label="Integration examples">
                {CODE_TABS.map((t, i) => (
                  <button
                    key={t.key}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`cp-tab-${t.key}`}
                    aria-selected={tab === t.key}
                    aria-controls="cp-tabpanel"
                    tabIndex={tab === t.key ? 0 : -1}
                    className={tab === t.key ? "is-on" : ""}
                    onClick={() => setTab(t.key)}
                    onKeyDown={(e) => onKey(e, i)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <button className="cp-panel__copy" onClick={() => copy(CODE[tab], tab)} aria-label={`Copy ${tab} example`}>
                {copied === tab ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <pre className="cp-code cp-panel__code" role="tabpanel" id="cp-tabpanel" aria-labelledby={`cp-tab-${tab}`} tabIndex={0}>
              {highlight(CODE[tab])}
            </pre>
          </div>
        </div>

        <div className="cp-apps" data-reveal>
          <p className="cp-apps__head">
            <span>Approved applications</span>
            <span>Cleared for use with untrusted input</span>
          </p>
          <ul className="cp-apps__list">
            {USE_CASES.map((u, i) => (
              <li key={u.title}>
                <span className="cp-apps__id">A-{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{u.title}</h3>
                  <p>{u.text}</p>
                </div>
                <span className="cp-apps__ok" aria-hidden="true">
                  ✓ Approved
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── §08 Field unit: Probe ───────────────────────────────────── */

export function Probe() {
  const { copied, copy } = useCopy();
  return (
    <section className="cp-sec cp-probe" id="probe" tabIndex={-1} aria-labelledby="cp-probe-h">
      <div className="cp-wrap">
        <Plate
          n="08"
          label="Field unit"
          code="FIELD REPORT FR-01 · BUILT ON VORA"
          id="cp-probe-h"
          title={
            <>
              Field unit: <span className="cp-lime-text">Probe.</span>
            </>
          }
        />
        <article className="cp-report" data-reveal>
          <Crops />
          <dl className="cp-report__fields">
            <div>
              <dt>Unit</dt>
              <dd>{PROBE.name}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>Incident investigator</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>Read-only</dd>
            </div>
            <div>
              <dt>Worker</dt>
              <dd>Vora sandbox · no network · no credentials</dd>
            </div>
          </dl>
          <div className="cp-report__main">
            <div className="cp-report__lead">
              <p className="cp-report__tag">{PROBE.tagline}</p>
              <p className="cp-report__desc">{PROBE.description}</p>
            </div>
            <ul className="cp-refusals">
              {PROBE.refusals.map((r, i) => (
                <li key={r.title} className="cp-refusal" style={{ "--i": i } as CSSProperties}>
                  <span className="cp-refusal__n">Claim {String(i + 1).padStart(2, "0")}</span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <span className="cp-refusal__stamp">Refused</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="cp-report__foot">
            <blockquote className="cp-finding">
              <span className="cp-finding__k">Finding</span>
              <p>“{PROBE.finding}”</p>
            </blockquote>
            <div className="cp-report__run">
              <div className="cp-cmdline">
                <pre className="cp-code">{highlight(`$ ${PROBE.command}`)}</pre>
                <button onClick={() => copy(PROBE.command, "probe")} aria-label="Copy Probe command">
                  {copied === "probe" ? "✓" : "Copy"}
                </button>
              </div>
              <a className="cp-link" href={LINKS.probe}>
                Deploy the field unit <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ── §09 Safety data sheet ───────────────────────────────────── */

export function SafetySheet() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="cp-sec cp-sds" id="sds" tabIndex={-1} aria-labelledby="cp-sds-h">
      <div className="cp-wrap">
        <Plate
          n="09"
          label="Safety data sheet"
          code={`SDS · ${STATUS.version} · ${STATUS.stage.toUpperCase()}`}
          id="cp-sds-h"
          title={
            <>
              Known hazards, <span className="cp-dim-text">on the label.</span>
            </>
          }
          sub="We would rather you read the limits here than discover them in production."
        />
        <div className="cp-sds__grid">
          <div className="cp-hazard" data-reveal>
            <div className="cp-hazard__inner">
              <p className="cp-hazard__sec">Section 2 — Hazard identification</p>
              <p className="cp-hazard__signal">
                <span>Signal word</span>
                <b>Warning</b>
              </p>
              <p className="cp-hazard__status">
                {STATUS.version} · {STATUS.stage} · {STATUS.license}
              </p>
              <ul className="cp-hazard__list">
                {LIMITS.map((l, i) => (
                  <li key={l}>
                    <span>H-{String(i + 1).padStart(2, "0")}</span>
                    <p>{l}</p>
                  </li>
                ))}
              </ul>
              <p className="cp-hazard__sec cp-hazard__sec--p">Precautionary statements</p>
              <ul className="cp-hazard__list cp-hazard__list--p">
                <li>
                  <span>P-01</span>
                  <p>For hostile workloads, select the gVisor backend per sandbox.</p>
                </li>
                <li>
                  <span>P-02</span>
                  <p>
                    Read the <a href={LINKS.threatModel}>threat model</a> before you rely on it.
                  </p>
                </li>
              </ul>
              <p className="cp-hazard__next">
                <span>Next revision</span>
                <b>{STATUS.next}</b>
              </p>
            </div>
          </div>

          <div className="cp-faq" data-reveal>
            <p className="cp-hazard__sec">Section 7 — Handling (FAQ)</p>
            {FAQ.map((f, i) => {
              const on = open === i;
              return (
                <div key={f.q} className={`cp-faq__item ${on ? "is-open" : ""}`}>
                  <h3>
                    <button
                      id={`cp-faq-q${i}`}
                      aria-expanded={on}
                      aria-controls={`cp-faq-a${i}`}
                      onClick={() => setOpen(on ? null : i)}
                    >
                      <span className="cp-faq__n">Q{String(i + 1).padStart(2, "0")}</span>
                      <span className="cp-faq__q">{f.q}</span>
                      <span className="cp-faq__icon" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="cp-faq__a" id={`cp-faq-a${i}`} role="region" aria-labelledby={`cp-faq-q${i}`} hidden={!on}>
                    <p>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── §10 Clearance ───────────────────────────────────────────── */

export function Clearance() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="cp-sec cp-clear" id="clearance" tabIndex={-1} aria-labelledby="cp-clear-h">
      <div className="cp-clear__tape" aria-hidden="true" />
      <div className="cp-wrap">
        <p className="cp-clear__kicker" data-reveal>
          §10 · Access control · Clearance level: early access
        </p>
        <h2 className="cp-clear__h" id="cp-clear-h" data-reveal>
          <span>Request</span>
          <span className="cp-clear__h2">clearance</span>
        </h2>
        <div className="cp-clear__grid">
          <div className="cp-clear__copy" data-reveal>
            <p className="cp-sub">
              Early builds, release notes and the occasional escape-attempt write-up. The chamber is open source today —
              clearance just puts you on the list.
            </p>
            {sent ? (
              <p className="cp-clear__ok" role="status">
                <b>Clearance pending ✓</b>
                <span>Subject {email} logged. Nothing else was.</span>
              </p>
            ) : (
              <form
                className="cp-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <label htmlFor="cp-email">Contact channel · email</label>
                <div className="cp-form__row">
                  <input
                    id="cp-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button className="cp-btn cp-btn--primary" type="submit">
                    Request clearance <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            )}
            <a className="cp-btn cp-btn--ghost cp-clear__gh" href={LINKS.github}>
              <GitHubIcon /> Read the source · {STATUS.version}
            </a>
          </div>

          <div className="cp-badge-wrap" data-reveal aria-hidden="true">
            <div className={`cp-badge ${sent ? "is-sent" : ""}`}>
              <span className="cp-badge__slot" />
              <div className="cp-badge__top">
                <MarkCell size={30} tone="mono" />
                <b>VORA</b>
                <span>VR-07</span>
              </div>
              <div className="cp-badge__tape" />
              <p className="cp-badge__type">Visitor pass</p>
              <dl className="cp-badge__fields">
                <div>
                  <dt>Subject</dt>
                  <dd>{email || "you@company.dev"}</dd>
                </div>
                <div>
                  <dt>Clearance</dt>
                  <dd>Early access</dd>
                </div>
                <div>
                  <dt>Zone</dt>
                  <dd>Chamber 01 · observe only</dd>
                </div>
              </dl>
              <div className="cp-badge__foot">
                <Barcode seed={email || "visitor"} ink="#0B0B0A" length={170} />
                <span>{STATUS.license} · {STATUS.version}</span>
              </div>
              {sent && <div className="cp-badge__stamp">Pending</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
