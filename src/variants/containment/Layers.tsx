import { useState, type ReactNode } from "react";
import { ATTACKS, LINKS } from "../../shared/content";
import { sid } from "./Chamber";
import { Plate, jumpTo } from "./ui";

type Layer = { id: string; name: string; short: string; tech: string; text: string; stops: string[] };

const LAYERS: Layer[] = [
  {
    id: "L1",
    name: "Identity",
    short: "spiffe:// agent id",
    tech: "spiffe://vora.sh/tenant/<t>/agent/<a>",
    text: "Every agent carries a name. Agent-bound API keys confine a key to one agent's sandboxes, so a leaked key exposes one agent — and every audit record answers which agent, on whose key.",
    stops: [],
  },
  {
    id: "L2",
    name: "Control plane",
    short: "one go daemon · audit sink",
    tech: "one Go runner daemon · no Kubernetes",
    text: "Schedules sandboxes, keeps credentials encrypted and writes every lifecycle event, exec and egress decision to JSONL or Postgres. An allow that can't be audited fails closed.",
    stops: [],
  },
  {
    id: "L3",
    name: "Network",
    short: "default-deny · sni · dns",
    tech: "default-deny · SNI egress gateway · allowlist DNS",
    text: "No interfaces, no routes. Open a door and only named hosts answer, through an SNI-inspecting gateway and a resolver that only knows the allowlist. Metadata, loopback and private ranges stay blocked in every mode.",
    stops: ["metadata", "dns"],
  },
  {
    id: "L4",
    name: "Credential broker",
    short: "attached upstream",
    tech: "secretless · attached upstream over TLS",
    text: "The token stays encrypted in the control plane. The gateway attaches it upstream for the one host its alias is bound to — it never enters the sandbox env, filesystem, /proc or the audit log.",
    stops: ["secrets"],
  },
  {
    id: "L5",
    name: "Syscall surface",
    short: "seccomp | gvisor",
    tech: "seccomp filter · or gVisor user-space kernel",
    text: "On Bubblewrap a seccomp filter trims the syscall surface — hardening, not the boundary. On gVisor a user-space kernel answers syscalls so they never reach yours. Pick per sandbox.",
    stops: [],
  },
  {
    id: "L6",
    name: "Namespaces",
    short: "pid · mount · net",
    tech: "Linux namespaces · read-only rootfs",
    text: "Its own process tree, its own mounts, its own empty network stack. The rootfs is read-only; only /workspace, /root and /tmp are writable.",
    stops: ["rootfs"],
  },
  {
    id: "L7",
    name: "Budgets",
    short: "cgroup v2",
    tech: "cgroup v2 · memory · cpu · pids · disk · ttl",
    text: "Everything it may consume is decided before it starts. Exceed it and it stops with a reason your agent can read: OOMKilled, PidsLimitExceeded or TimeoutExceeded.",
    stops: ["forkbomb", "membomb"],
  },
  {
    id: "CORE",
    name: "Specimen",
    short: "your agent's code",
    tech: "AI agents · generated scripts · untrusted PRs · plugins",
    text: "Assume malicious. Whatever you put here — an agent's tool call, an LLM-written script, a stranger's test suite — only ever sees what the seven layers above let through.",
    stops: [],
  },
];

const X0 = 40;
const Y0 = 58;
const W0 = 520;
const H0 = 452;
const S = 26;
const box = (i: number) => ({ x: X0 + i * S, y: Y0 + i * S, w: W0 - 2 * i * S, h: H0 - 2 * i * S });

function ring(i: number) {
  const o = box(i);
  const n = box(i + 1);
  return `M${o.x} ${o.y}h${o.w}v${o.h}h${-o.w}Z M${n.x} ${n.y}h${n.w}v${n.h}h${-n.w}Z`;
}

function Hatch({ i, on }: { i: number; on: boolean }) {
  const id = `cp-hatch-${i}${on ? "-on" : ""}`;
  const stroke = on ? "#D4FF3F" : "#E9E6DC";
  const op = on ? 0.8 : 0.22;
  const line = (d: string, w = 1) => <path d={d} stroke={stroke} strokeOpacity={op} strokeWidth={w} />;
  const kinds: [number, number, ReactNode][] = [
    [8, 45, line("M0 0V8")],
    [8, -45, line("M0 0V8")],
    [9, 45, <>{line("M0 0V9")}{line("M0 0H9")}</>],
    [6, 0, line("M0 0H6")],
    [6, 45, <circle cx="3" cy="3" r="0.9" fill={stroke} fillOpacity={op + 0.1} />],
    [6, 0, line("M0 0V6")],
    [4, 45, line("M0 0V4")],
  ];
  const [size, rot, content] = kinds[i];
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rot})`}>
      {content}
    </pattern>
  );
}

export function Layers() {
  const [sel, setSel] = useState(2);
  const layer = LAYERS[sel];
  const core = box(7);

  return (
    <section className="cp-sec cp-layers" id="layers" tabIndex={-1} aria-labelledby="cp-layers-h">
      <div className="cp-wrap">
        <Plate
          n="02"
          label="Containment layers"
          code="DWG CP-LAY-07 · SECTION A–A"
          id="cp-layers-h"
          title={
            <>
              Seven walls <span className="cp-dim-text">between it and you.</span>
            </>
          }
          sub="A section cut through one sandbox, from the host boundary down to the code you don't trust. Hover or focus a layer to read its spec — and test the ones that stop a specimen."
        />

        <div className="cp-layers__grid" data-reveal>
          <figure className="cp-drawing">
            <svg viewBox="0 0 900 560" className="cp-drawing__svg" role="img" aria-labelledby="cp-dwg-title">
              <title id="cp-dwg-title">
                Cross-section of a Vora sandbox: identity, control plane, network, credential broker, syscall surface,
                namespaces and budgets nested around the specimen.
              </title>
              <defs>
                {LAYERS.slice(0, 7).map((_, i) => (
                  <g key={i}>
                    <Hatch i={i} on={false} />
                    <Hatch i={i} on />
                  </g>
                ))}
                <pattern id="cp-hatch-core" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                  <path d="M0 0V5" stroke="#FF4A1C" strokeOpacity="0.45" />
                </pattern>
                <marker id="cp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 1 L9 5 L0 9" fill="none" stroke="#8F8C82" strokeWidth="1.4" />
                </marker>
              </defs>

              {/* top dimension */}
              <g className="cp-dwg__dim">
                <path d={`M${X0} ${Y0 - 4}V18 M${X0 + W0} ${Y0 - 4}V18`} />
                <path d={`M${X0 + 2} 26H${X0 + W0 - 2}`} markerStart="url(#cp-arrow)" markerEnd="url(#cp-arrow)" />
                <rect x={X0 + W0 / 2 - 118} y="17" width="236" height="18" className="cp-dwg__knock" />
                <text x={X0 + W0 / 2} y="30" textAnchor="middle">HOST · OUTER BOUNDARY → SPECIMEN</text>
              </g>

              {/* left depth dimension */}
              <g className="cp-dwg__dim">
                <path d={`M16 ${Y0}V${core.y}`} />
                {Array.from({ length: 8 }).map((_, k) => (
                  <path key={k} d={`M11 ${Y0 + k * S}H21`} />
                ))}
                <text x="-150" y="10" transform="rotate(-90)" textAnchor="middle" className="cp-dwg__rot">
                  7 BOUNDARIES DEEP
                </text>
              </g>

              {LAYERS.slice(0, 7).map((l, i) => {
                const b = box(i);
                const on = sel === i;
                const dx = b.x + b.w - S / 2;
                const dy = b.y + S / 2;
                const ly = 66 + i * 56;
                return (
                  <g
                    key={l.id}
                    className={`cp-dwg__layer ${on ? "is-on" : ""}`}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => setSel(i)}
                  >
                    <path d={ring(i)} fillRule="evenodd" fill="#0B0B0A" />
                    <path d={ring(i)} fillRule="evenodd" fill={`url(#cp-hatch-${i}${on ? "-on" : ""})`} />
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} className="cp-dwg__edge" />
                    <path d={`M${dx} ${dy}H585L608 ${ly}H616`} className="cp-dwg__leader" />
                    <circle cx={dx} cy={dy} r="3" className="cp-dwg__dot" />
                    <rect x="616" y={ly - 11} width="34" height="20" className="cp-dwg__tag" />
                    <text x="633" y={ly + 3.5} textAnchor="middle" className="cp-dwg__tagtext">
                      {l.id}
                    </text>
                    <text x="660" y={ly + 4} className="cp-dwg__name">
                      {l.name.toUpperCase()}
                    </text>
                    <text x="660" y={ly + 20} className="cp-dwg__tech">
                      {l.short}
                    </text>
                  </g>
                );
              })}

              <g
                className={`cp-dwg__core ${sel === 7 ? "is-on" : ""}`}
                onMouseEnter={() => setSel(7)}
                onClick={() => setSel(7)}
              >
                <rect x={core.x} y={core.y} width={core.w} height={core.h} fill="#0B0B0A" />
                <rect x={core.x} y={core.y} width={core.w} height={core.h} fill="url(#cp-hatch-core)" />
                <rect x={core.x} y={core.y} width={core.w} height={core.h} className="cp-dwg__coreedge" />
                <text x={core.x + core.w / 2} y={core.y + 42} textAnchor="middle" className="cp-dwg__coretitle">
                  SPECIMEN
                </text>
                <text x={core.x + core.w / 2} y={core.y + 62} textAnchor="middle" className="cp-dwg__coresub">
                  your agent's code
                </text>
                <circle cx={core.x + 12} cy={core.y + 12} r="3.5" className="cp-dwg__pulse" />
              </g>

              {/* title block */}
              <g className="cp-dwg__block">
                <rect x="616" y="470" width="268" height="72" />
                <path d="M616 494H884 M616 518H884 M786 494V542" />
                <text x="626" y="487" className="cp-dwg__bt">DWG CP-LAY-07 · SECTION A–A</text>
                <text x="626" y="511">ONE SANDBOX · 7 LAYERS</text>
                <text x="626" y="535">VORA RUNTIME v0.7</text>
                <text x="796" y="511">SCALE: NTS</text>
                <text x="796" y="535">SHEET 02</text>
              </g>
            </svg>
            <figcaption className="cp-drawing__cap">
              <span>Fig. 2 — Section A–A</span>
              <span>Not to scale</span>
            </figcaption>
          </figure>

          <div className="cp-layers__side">
            <ol className="cp-layers__list">
              {LAYERS.map((l, i) => (
                <li key={l.id}>
                  <button
                    className={sel === i ? "is-on" : ""}
                    aria-pressed={sel === i}
                    aria-controls="cp-layer-spec"
                    onMouseEnter={() => setSel(i)}
                    onFocus={() => setSel(i)}
                    onClick={() => setSel(i)}
                  >
                    <span className="cp-layers__id">{l.id}</span>
                    <span className="cp-layers__name">{l.name}</span>
                    <span className="cp-layers__arrow" aria-hidden="true">
                      ▸
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="cp-spec" id="cp-layer-spec" key={layer.id}>
              <p className="cp-spec__head">
                <span>{layer.id}</span>
                <span>{layer.name}</span>
              </p>
              <p className="cp-spec__tech">{layer.tech}</p>
              <p className="cp-spec__text">{layer.text}</p>
              {layer.stops.length > 0 && (
                <div className="cp-spec__stops">
                  <span className="cp-spec__label">Stops in the chamber</span>
                  {layer.stops.map((id) => {
                    const i = ATTACKS.findIndex((a) => a.id === id);
                    return (
                      <button
                        key={id}
                        className="cp-spec__chip"
                        onClick={() => {
                          jumpTo("chamber");
                          window.dispatchEvent(new CustomEvent("cp-inject", { detail: id }));
                        }}
                      >
                        {sid(i)} · {ATTACKS[i].name} <span aria-hidden="true">↺</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <a className="cp-link" href={LINKS.threatModel}>
              Read the threat model <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
