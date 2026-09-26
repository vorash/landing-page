import { useEffect, useState } from "react";
import { MarkPrism } from "../shared/logos";
import { useCopy, useReducedMotion, useReveal } from "../shared/hooks";
import { useTheme } from "../shared/theme";
import { LINKS, PROBE_PAGE } from "../shared/content";
import { Arrow, GitHubIcon, SecHead } from "../landing/parts";
import "../landing/fonts.css";
import "../landing/cleanroom.css";
import "./probe.css";

export default function ProbePage() {
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
    <div className="cr cr-probe-page" ref={root} data-theme={theme}>
      <a className="cr-skip" href="#probe-main">Skip to content</a>
      <nav className="cr-nav cp-nav" aria-label="Primary">
        <div className="cr-wrap cr-nav__in">
          <a className="cr-logo" href="/" aria-label="Vora home"><MarkPrism size={26} /><span>vora</span></a>
          <span className="cp-nav__divider" aria-hidden="true" />
          <a className="cp-nav__product" href="#top">/ probe</a>
          <div className="cp-nav__links">
            <a href="#cases">The cases</a>
            <a href="#method">How it works</a>
            <a href="#try">Try it</a>
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
            <a className="cr-btn cr-btn--primary cr-btn--sm" href={LINKS.probe}>Source <Arrow /></a>
          </div>
        </div>
      </nav>

      <main id="probe-main">
        <header className="cp-hero" id="top">
          <div className="cr-wrap cp-hero__grid">
            <div className="cp-hero__copy">
              <p className="cp-overline"><span className="cp-overline__mark" /> {PROBE_PAGE.eyebrow}</p>
              <h1 className="cp-h1">{PROBE_PAGE.headline[0]}<br /><em>{PROBE_PAGE.headline[1]}</em></h1>
              <p className="cp-lede">{PROBE_PAGE.intro}</p>
              <div className="cr-ctas">
                <a className="cr-btn cr-btn--primary" href="#try">Run the replay <Arrow /></a>
                <a className="cr-btn cr-btn--glass" href="#cases">See the refusals <Arrow /></a>
              </div>
              <p className="cr-fine">{PROBE_PAGE.traits.map((trait) => <span key={trait}>{trait}</span>)}</p>
            </div>
            <EvidenceVisual />
          </div>
          <div className="cr-wrap cp-hero__index"><span>PROBE / 001</span><span>OBSERVE → EVALUATE → REPORT</span><span>↓ SCROLL TO INVESTIGATE</span></div>
        </header>

        <section className="cr-sec cp-cases" id="cases" aria-labelledby="cp-cases-title">
          <div className="cr-wrap">
            <SecHead n="01" label="The evidence has the last word" title={<span id="cp-cases-title">Four cases. <span className="cr-soft">Four lines it won't cross.</span></span>}
              sub={PROBE_PAGE.caseIntro} />
            <CaseExplorer />
          </div>
        </section>

        <section className="cr-sec cp-method" id="method" aria-labelledby="cp-method-title">
          <div className="cr-wrap">
            <SecHead n="02" label="The trust boundary" title={<span id="cp-method-title">The worker asks. <span className="cr-soft">The controller decides.</span></span>}
              sub={PROBE_PAGE.method.intro} />
            <div className="cp-flow" data-reveal>
              <div className="cp-flow__box cp-flow__box--controller">
                <span className="cp-flow__eyebrow">TRUSTED / CONTROLLER</span>
                <h3>{PROBE_PAGE.method.controller.title[0]}<br />{PROBE_PAGE.method.controller.title[1]}</h3>
                <p>{PROBE_PAGE.method.controller.text}</p>
                <span className="cp-flow__meta">{PROBE_PAGE.method.controller.meta}</span>
              </div>
              <div className="cp-flow__link" aria-hidden="true"><span>bounded state ↓</span><span>↑ one request or report</span></div>
              <div className="cp-flow__box cp-flow__box--worker">
                <span className="cp-flow__eyebrow">UNTRUSTED / WORKER</span>
                <h3>{PROBE_PAGE.method.worker.title[0]}<br />{PROBE_PAGE.method.worker.title[1]}</h3>
                <p>{PROBE_PAGE.method.worker.text}</p>
                <span className="cp-flow__meta">{PROBE_PAGE.method.worker.meta}</span>
              </div>
            </div>
            <ol className="cp-layers" data-reveal>
              {PROBE_PAGE.layers.map((layer) => <li key={layer.number}>
                <span className="cp-layers__n">{layer.number}</span>
                <div><h3>{layer.title}</h3><p>{layer.detail}</p></div>
              </li>)}
            </ol>
            <p className="cp-method__note" data-reveal>{PROBE_PAGE.method.note}</p>
          </div>
        </section>

        <section className="cr-sec cp-try" id="try" aria-labelledby="cp-try-title">
          <div className="cr-wrap cp-try__grid">
            <div data-reveal>
              <SecHead n="03" label="Run it yourself" title={<span id="cp-try-title">A case you can <span className="cr-soft">replay.</span></span>}
                sub={PROBE_PAGE.tryIntro} />
              <a className="cr-tlink" href={LINKS.probe}><GitHubIcon /> View the repository <Arrow /></a>
              <div className="cp-try__aside"><b>What comes out</b><p>{PROBE_PAGE.tryAside}</p></div>
            </div>
            <ReplayTerminal />
          </div>
        </section>

        <section className="cr-sec cp-honest" aria-labelledby="cp-honest-title">
          <div className="cr-wrap cp-honest__grid" data-reveal>
            <div>
              <p className="cp-overline">STATUS / {PROBE_PAGE.status}</p>
              <h2 className="cr-h2" id="cp-honest-title">Readable results.<br /><span className="cr-soft">Honest limits.</span></h2>
            </div>
            <div className="cp-honest__text">
              {PROBE_PAGE.limits.map((limit) => <p key={limit}>{limit}</p>)}
              <a className="cr-tlink" href={`${LINKS.probe}/blob/main/docs/architecture.md`}>Read the architecture <Arrow /></a>
            </div>
          </div>
        </section>

        <section className="cp-end" aria-labelledby="cp-end-title">
          <div className="cr-wrap cp-end__in">
            <span className="cp-end__stamp">NO GUESSWORK / NO MUTATIONS</span>
            <h2 id="cp-end-title">{PROBE_PAGE.closing[0]}<br /><em>{PROBE_PAGE.closing[1]}</em></h2>
            <p>Read the claims policy, inspect the fixtures, or run a replay locally.</p>
            <div className="cr-ctas">
              <a className="cr-btn cr-btn--primary" href={LINKS.probe}>Explore Vora Probe <Arrow /></a>
              <a className="cr-btn cr-btn--glass" href={`${LINKS.probe}/blob/main/docs/claims-policy.md`}>Claims policy <Arrow /></a>
            </div>
          </div>
        </section>
      </main>
      <footer className="cr-foot"><div className="cr-wrap cr-foot__in">
        <a className="cr-logo" href="/" aria-label="Vora home"><MarkPrism size={20} /><span>vora</span></a>
        <nav className="cr-foot__links" aria-label="Footer"><a href="/">Vora</a><a href={LINKS.probe}>Probe on GitHub</a><a href={`${LINKS.probe}/blob/main/docs/claims-policy.md`}>Claims policy</a><a href={`${LINKS.probe}/blob/main/docs/architecture.md`}>Architecture</a></nav>
        <p className="cr-foot__legal">MIT · © {new Date().getFullYear()} Vora</p>
      </div></footer>
    </div>
  );
}

function EvidenceVisual() {
  return <div className="cp-visual" aria-label="Illustration of evidence being checked against a proposed claim">
    <div className="cp-visual__grid" aria-hidden="true" />
    <div className="cp-file cp-file--evidence">
      <div className="cp-file__top"><span>PROBE / EVIDENCE</span><span>01—03</span></div>
      <div className="cp-file__title">What was observed</div>
      {PROBE_PAGE.illustration.evidence.map((line, i) => <div className="cp-file__row" key={line}><b>OBS-0{i + 1}</b><span>{line}</span><i className={`cp-dot cp-dot--${i === 2 ? "no" : "yes"}`} /></div>)}
      <div className="cp-file__footer">OBSERVATIONS · OOM FIXTURE</div>
    </div>
    <div className="cp-visual__wire" aria-hidden="true"><i /><i /></div>
    <div className="cp-file cp-file--verdict">
      <div className="cp-file__top"><span>CLAIMS / REVIEW</span><span>01—02</span></div>
      <div className="cp-verdict cp-verdict--yes"><span>ADMISSIBLE</span><strong>{PROBE_PAGE.illustration.admitted}</strong><small>{PROBE_PAGE.illustration.admittedNote}</small></div>
      <div className="cp-verdict cp-verdict--no"><span>REFUSED</span><strong>{PROBE_PAGE.illustration.refused}</strong><small>{PROBE_PAGE.illustration.refusedNote}</small></div>
      <div className="cp-file__footer">NO REMEDIATION EXECUTED</div>
    </div>
    <span className="cp-visual__caption">01 / {PROBE_PAGE.illustration.caption}</span>
  </div>;
}

function CaseExplorer() {
  const [selected, setSelected] = useState(0);
  const c = PROBE_PAGE.cases[selected];
  return <div className="cp-cases__grid" data-reveal>
    <div className="cp-cases__list" aria-label="Fixture cases">
      {PROBE_PAGE.cases.map((item, i) => <button key={item.id} type="button" className={`cp-case ${selected === i ? "is-on" : ""}`}
        aria-pressed={selected === i} onClick={() => setSelected(i)}>
        <span className="cp-case__index">{item.label}</span><span className="cp-case__title">{item.title}</span><span className="cp-case__arrow" aria-hidden="true">↗</span>
      </button>)}
    </div>
    <article className="cp-dossier" aria-live="polite" aria-atomic="true" key={c.id}>
      <div className="cp-dossier__bar"><span>CASE FILE / {c.id}</span><span>FROZEN FIXTURE</span></div>
      <div className="cp-dossier__body">
        <p className="cp-dossier__k">OBSERVATION</p><p className="cp-dossier__observation">{c.observation}</p>
        <div className="cp-dossier__rule" />
        <div className="cp-dossier__verdict"><span className="cp-dossier__tag cp-dossier__tag--yes">SUPPORTED</span><p>{c.allowed}</p></div>
        <div className="cp-dossier__verdict"><span className="cp-dossier__tag cp-dossier__tag--no">REFUSED</span><p>{c.refused}</p></div>
        <p className="cp-dossier__why">{c.why}</p>
      </div>
      <div className="cp-dossier__foot">SOURCE / test/fixtures/oom/{c.id}</div>
    </article>
  </div>;
}

function ReplayTerminal() {
  const { copied, copy } = useCopy();
  const commands = [...PROBE_PAGE.setup, PROBE_PAGE.replay].join("\n");
  return <div className="cp-terminal" data-reveal>
    <div className="cp-terminal__bar"><span className="cp-terminal__dots" aria-hidden="true"><i /><i /><i /></span><span>local / replay</span>
      <button type="button" onClick={() => copy(commands, "replay")}>{copied === "replay" ? "Copied ✓" : "Copy commands"}</button>
    </div>
    <pre><code><span className="cp-terminal__comment"># from a machine with {PROBE_PAGE.requirement}</span>{"\n"}{[...PROBE_PAGE.setup, PROBE_PAGE.replay].map((line, i) => <span key={line}><span className="cp-terminal__prompt">$ </span>{line}{i < PROBE_PAGE.setup.length ? "\n" : ""}</span>)}</code></pre>
    <div className="cp-terminal__files"><p>WRITTEN UNDER .probe/ (RUN ID VARIES)</p><ul>{PROBE_PAGE.artifacts.map((a) => <li key={a}><span aria-hidden="true">↳</span>{a}</li>)}</ul></div>
    <p className="cr-sr" aria-live="polite">{copied === "replay" ? "Replay commands copied." : ""}</p>
  </div>;
}
