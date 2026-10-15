import { createRoot } from "react-dom/client";
import policy from "virtual:mail-privacy";
import { DocPage } from "../shared/DocPage";
import { MAIL_LINKS } from "../shared/content";
import "../shared/base.css";

createRoot(document.getElementById("root")!).render(
  <DocPage product="mail" productHref="/mail/" eyebrow="Vora Mail · Privacy policy" title="Privacy policy" toc={policy.toc}
    meta={<>
      <span>Effective {policy.effective}</span>
      <span>Questions: <a href={MAIL_LINKS.contact}>{MAIL_LINKS.contactAddress}</a></span>
      <span><a href="/mail/">About Vora Mail</a></span>
    </>}>
    <div dangerouslySetInnerHTML={{ __html: policy.html }} />
  </DocPage>,
);
