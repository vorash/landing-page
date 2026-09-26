import { useEffect, useState } from "react";
import { useInView } from "../shared/hooks";
import { AUDIT_LOG, PILLARS } from "../shared/content";
import { SecHead } from "./parts";

const MCP_TOOLS = [
  "sandbox_create",
  "sandbox_exec",
  "sandbox_read_file",
  "sandbox_write_file",
  "sandbox_stats",
  "sandbox_destroy",
];

export function Instruments({ reduced }: { reduced: boolean }) {
  const [ref, inView] = useInView<HTMLElement>(0.12);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1400);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  return (
    <section className="cr-sec cr-inst" id="instruments" ref={ref} aria-labelledby="cr-inst-title">
      <div className="cr-wrap">
        <SecHead
          n="02"
          label="Instruments"
          title={<span id="cr-inst-title">Eight instruments. <span className="cr-soft">One sealed room.</span></span>}
          sub="Every guarantee Vora makes is a thing you can read off a dial: what the box may reach, what it may spend, who it is, and what it did."
        />
        <div className="cr-inst__grid">
          {PILLARS.map((p, i) => (
            <article
              key={p.key}
              className={`cr-panel cr-panel--${p.key}`}
              data-reveal
              style={{ transitionDelay: `${(i % 4) * 70}ms` }}
            >
              <header className="cr-panel__top">
                <span className="cr-panel__ch">CH-{String(i + 1).padStart(2, "0")}</span>
                <span className="cr-panel__key">{p.key}</span>
                <span className="cr-led" aria-hidden="true" />
              </header>
              <div className="cr-panel__screen" aria-hidden="true">
                <Visual k={p.key} tick={tick} />
              </div>
              <h3 className="cr-panel__title">{p.title}</h3>
              <p className="cr-panel__line">{p.line}</p>
              <p className="cr-panel__detail">{p.detail}</p>
              <code className="cr-panel__proof">{p.proof}</code>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Visual({ k, tick }: { k: string; tick: number }) {
  switch (k) {
    case "network": {
      const hosts: [string, boolean][] = [
        ["pypi.org:443", true],
        ["169.254.169.254:80", false],
        ["exfil.attacker.io", false],
      ];
      const knock = tick % 3;
      return (
        <ul className="cr-v-net">
          {hosts.map(([host, on], i) => (
            <li key={host} className={knock === i ? "is-knock" : ""}>
              <span className="cr-v-net__host">{host}</span>
              <span className={`cr-v-net__verdict ${on ? "is-ok" : "is-no"}`}>
                {knock === i ? (on ? "allow" : "deny") : on ? "listed" : "—"}
              </span>
              <span className={`cr-tog ${on ? "is-on" : ""}`}>
                <i />
              </span>
            </li>
          ))}
        </ul>
      );
    }
    case "audit": {
      const rows = [0, 1, 2, 3].map((j) => {
        const idx = (tick + j) % AUDIT_LOG.length;
        return { ...AUDIT_LOG[idx], idx, n: tick + j };
      });
      return (
        <ol className="cr-v-log">
          {rows.map((r) => (
            <li
              key={r.n}
              className={`is-${r.kind} ${/denied|NXDOMAIN/.test(r.text) ? "is-bad" : ""}`}
            >
              <time>{r.t.slice(6)}</time>
              <b>{r.kind}</b>
              <span>{r.text}</span>
            </li>
          ))}
        </ol>
      );
    }
    case "identity": {
      const seg = tick % 3;
      return (
        <div className="cr-v-id">
          <p className="cr-v-id__uri">
            <span className="cr-v-id__scheme">spiffe://</span>
            <span className={seg === 0 ? "is-on" : ""}>vora.sh</span>
            <span className={seg === 1 ? "is-on" : ""}>/tenant/t1</span>
            <span className={seg === 2 ? "is-on" : ""}>/agent/reviewer</span>
          </p>
          <p className="cr-v-id__legend">
            <span className={seg === 0 ? "is-on" : ""}>trust domain</span>
            <span className={seg === 1 ? "is-on" : ""}>tenant</span>
            <span className={seg === 2 ? "is-on" : ""}>agent</span>
          </p>
          <p className="cr-v-id__key">key vora_… → bound to agent/reviewer</p>
        </div>
      );
    }
    case "isolation": {
      const g = Math.floor(tick / 2) % 2 === 1;
      return (
        <div className="cr-v-iso">
          <div className={`cr-v-iso__switch ${g ? "is-g" : ""}`}>
            <span className={!g ? "is-on" : ""}>bwrap</span>
            <span className={g ? "is-on" : ""}>gvisor</span>
            <i />
          </div>
          <ul className="cr-v-iso__stack">
            {(g
              ? ["workload", "gVisor user-space kernel", "host kernel · untouched"]
              : ["workload", "namespaces · cgroup v2 · seccomp", "host kernel · shared"]
            ).map((l, i) => (
              <li key={l} className={i === 1 ? "is-mid" : ""}>{l}</li>
            ))}
          </ul>
        </div>
      );
    }
    case "secrets": {
      const glyphs = "••••••••••••";
      const shimmer = tick % glyphs.length;
      return (
        <dl className="cr-v-sec">
          <div>
            <dt>control plane</dt>
            <dd className="cr-v-sec__tok">
              ghp_
              {glyphs.split("").map((c, i) => (
                <span key={i} className={i === shimmer ? "is-hi" : ""}>{c}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>sandbox env</dt>
            <dd>VORA_BROKER_URL</dd>
          </div>
          <div>
            <dt>GITHUB_TOKEN</dt>
            <dd className="cr-v-sec__none">unset · nothing to steal</dd>
          </div>
        </dl>
      );
    }
    case "fork": {
      const ys = [16, 44, 72, 100];
      return (
        <svg className="cr-v-fork" viewBox="0 0 240 116" preserveAspectRatio="xMidYMid meet">
          <line x1="14" y1="58" x2="70" y2="58" className="cr-v-fork__trunk" />
          {ys.map((y, i) => (
            <path
              key={y}
              d={`M70 58 C 110 58, 110 ${y}, 150 ${y} L 176 ${y}`}
              className={`cr-v-fork__br ${i === 1 ? "is-ok" : ""}`}
            />
          ))}
          <circle cx="14" cy="58" r="4" className="cr-v-fork__node" />
          <rect x="62" y="50" width="16" height="16" rx="3" className="cr-v-fork__snap" />
          {ys.map((y, i) => (
            <g key={`t${y}`}>
              <circle cx="180" cy={y} r="4" className={`cr-v-fork__end ${i === 1 ? "is-ok" : ""}`} />
              <text x="190" y={y + 3.5} className={`cr-v-fork__txt ${i === 1 ? "is-ok" : ""}`}>
                {i === 1 ? "pass" : "fail"}
              </text>
            </g>
          ))}
        </svg>
      );
    }
    case "budgets": {
      const mem = [318, 356, 297, 402, 341][tick % 5];
      const pids = [38, 41, 52, 44, 47][tick % 5];
      const cpu = [42, 61, 55, 73, 38][tick % 5];
      const ttl = Math.max(0, 552 - tick * 7);
      const mm = String(Math.floor(ttl / 60)).padStart(2, "0");
      const ss = String(ttl % 60).padStart(2, "0");
      return (
        <div className="cr-v-bud">
          {[
            { k: "mem", v: `${mem}/512Mi`, f: mem / 512 },
            { k: "cpu", v: `${cpu}% of 1`, f: cpu / 100 },
            { k: "pids", v: `${pids}/128`, f: pids / 128 },
          ].map((b) => (
            <div key={b.k} className="cr-v-bud__row">
              <span>{b.k}</span>
              <span className="cr-v-bud__bar">
                <i style={{ transform: `scaleX(${b.f})` }} />
              </span>
              <b>{b.v}</b>
            </div>
          ))}
          <div className="cr-v-bud__row cr-v-bud__ttl">
            <span>ttl</span>
            <b>{mm}:{ss} left</b>
          </div>
        </div>
      );
    }
    case "agents": {
      const on = tick % MCP_TOOLS.length;
      return (
        <ul className="cr-v-mcp">
          {MCP_TOOLS.map((t, i) => (
            <li key={t} className={i === on ? "is-on" : ""}>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      );
    }
    default:
      return null;
  }
}
