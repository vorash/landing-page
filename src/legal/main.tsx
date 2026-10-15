import { createRoot } from "react-dom/client";
import { DocPage } from "../shared/DocPage";
import { LEGAL_PAGE, MAIL_LINKS } from "../shared/content";
import "../shared/base.css";

createRoot(document.getElementById("root")!).render(
  <DocPage product="legal" productHref="/legal" eyebrow="vora.sh · Mentions légales" title="Legal notice"
    toc={LEGAL_PAGE.sections.map((s) => ({ id: s.id, text: s.title }))}
    meta={<span>Last updated {LEGAL_PAGE.updated}</span>}>
    {LEGAL_PAGE.sections.map((s) => <section key={s.id} aria-labelledby={s.id}>
      <h2 id={s.id}>{s.title}</h2>
      {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
      {s.contact && <p>Contact: <a href={MAIL_LINKS.contact}>{MAIL_LINKS.contactAddress}</a></p>}
      {s.card && <address className="cd-card">{s.card.map((line, i) => <p key={line}>{i === 0 ? <strong>{line}</strong> : line}</p>)}</address>}
      {s.links?.map((l) => <p key={l.href}><a href={l.href}>{l.text}</a></p>)}
    </section>)}
  </DocPage>,
);
