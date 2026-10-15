import { useEffect, type ReactNode } from "react";
import { MarkPrism } from "./logos";
import { useReducedMotion } from "./hooks";
import { useTheme } from "./theme";
import { MAIL_LINKS } from "./content";
import "../landing/fonts.css";
import "../landing/cleanroom.css";
// The nav is the Probe page's (cp-*).
import "../probe/probe.css";
import "./doc.css";

// The long-form layout of /mail/privacy and /legal: nav, title block, a table
// of contents beside the text, and the site footer.
export function DocPage({ product, productHref, eyebrow, title, meta, toc, children }: {
  product: string;
  productHref: string;
  eyebrow: string;
  title: string;
  meta?: ReactNode;
  toc: { id: string; text: string }[];
  children: ReactNode;
}) {
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
    <div className="cr cr-doc-page" data-theme={theme}>
      <a className="cr-skip" href="#doc-main">Skip to content</a>
      <nav className="cr-nav cp-nav" aria-label="Primary">
        <div className="cr-wrap cr-nav__in">
          <a className="cr-logo" href="/" aria-label="Vora home"><MarkPrism size={26} /><span>vora</span></a>
          <span className="cp-nav__divider" aria-hidden="true" />
          <a className="cp-nav__product" href={productHref}>/ {product}</a>
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
          </div>
        </div>
      </nav>

      <main id="doc-main" className="cd-doc">
        <header className="cr-wrap cd-doc__head">
          <p className="cp-overline">{eyebrow}</p>
          <h1>{title}</h1>
          {meta && <div className="cd-doc__meta">{meta}</div>}
        </header>
        <div className="cr-wrap cd-doc__grid">
          {toc.length > 1 && <nav className="cd-doc__toc" aria-label="Contents">
            <details open>
              <summary>Contents</summary>
              <ol>{toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}</ol>
            </details>
          </nav>}
          <article className="cd-doc__body">{children}</article>
        </div>
      </main>

      <footer className="cr-foot"><div className="cr-wrap cr-foot__in">
        <a className="cr-logo" href="/" aria-label="Vora home"><MarkPrism size={20} /><span>vora</span></a>
        <nav className="cr-foot__links" aria-label="Footer">
          <a href="/">Vora</a><a href="/probe/">Probe</a><a href="/mail/">Mail</a>
          <a href={MAIL_LINKS.privacy}>Mail privacy</a><a href={MAIL_LINKS.legal}>Legal notice</a>
          <a href={MAIL_LINKS.contact}>{MAIL_LINKS.contactAddress}</a>
        </nav>
        <p className="cr-foot__legal">© {new Date().getFullYear()} Vora</p>
      </div></footer>
    </div>
  );
}
