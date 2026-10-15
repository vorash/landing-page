import { readFileSync } from "fs";
import { Marked } from "marked";
import type { Plugin } from "vite";

// Renders Vora Mail's privacy policy (src/mail/privacy-policy.md, copied from
// vorash/vora-mail by scripts/sync-mail-privacy.sh) at build time, as the
// module `virtual:mail-privacy`. The page ships HTML, not a Markdown parser.
//
// The draft carries a banner, two reviewer-only appendices and [OWNER: …] /
// [LEGAL: …] / [PLACEHOLDER] markers. The banner and appendices are removed.
// A marker left in the text fails the build: the policy is published only once
// the owner has approved it. MAIL_PRIVACY_DRAFT=1 shows the markers highlighted
// instead, for local review only.

const ID = "virtual:mail-privacy";
// [OWNER: …], [LEGAL: …] and all-caps placeholders such as [EFFECTIVE DATE].
// An all-caps link text like [TLS](…) would match too; none exists today.
const MARKER = /`?\[(?:(?:OWNER|LEGAL):[\s\S]*?|[A-Z][A-Z ]{2,})\]`?/g;
// The policy's own "Effective date: …" line under its title. The page shows it
// in its header, so the line is taken out of the body.
const EFFECTIVE = /^\**Effective date:?\**\s*`?([^`\n]+?)`?\.?\s*\n+/m;

export function prepare(raw: string) {
  let md = raw.replace(/<!--[\s\S]*?-->\n?/g, "").trimStart();
  md = md.replace(/^# .*\n+/, ""); // the page has its own title
  const date = EFFECTIVE.exec(md);
  if (date) md = md.slice(0, date.index) + md.slice(date.index + date[0].length);
  const effective = date?.[1] ?? "[EFFECTIVE DATE]";
  const banner = /^(?:>.*\n)+\n*/.exec(md)?.[0] ?? ""; // the DRAFT banner
  md = md.slice(banner.length);
  const appendix = md.search(/^## Appendix A\b/m);
  if (appendix >= 0) md = md.slice(0, appendix);
  md = md.replace(/\n-{3,}\s*$/, "\n"); // the rule that stood before the appendices
  const markers = [...`${effective}\n${md}`.matchAll(MARKER)].map((m) => m[0].replace(/\s+/g, " "));
  // The appendices are gone, so a sentence that still points at one is unfinished too.
  for (const m of md.replace(MARKER, "").matchAll(/[^.\n]*\bAppendix [AB]\b[^.\n]*\.?/g)) markers.push(`reference to a removed appendix: "${m[0].trim()}"`);
  return { md, effective, markers };
}

function slug(text: string) {
  return text.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function render(md: string, draft: boolean) {
  const toc: { id: string; text: string }[] = [];
  const marked = new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        const html = this.parser.parseInline(tokens);
        const id = slug(text);
        if (depth === 2) toc.push({ id, text: text.replace(/[`*]/g, "") });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
    },
  });
  if (draft) md = md.replace(MARKER, (m) => `<mark class="cd-doc__todo">${m.replace(/`/g, "")}</mark>`);
  const html = (marked.parse(md) as string)
    .replace(/<table>/g, '<div class="cd-doc__table"><table>')
    .replace(/<\/table>/g, "</table></div>");
  return { html, toc };
}

export function mailPrivacy(file: string): Plugin {
  const draft = process.env.MAIL_PRIVACY_DRAFT === "1";
  return {
    name: "mail-privacy",
    resolveId: (id) => (id === ID ? `\0${ID}` : null),
    load(id) {
      if (id !== `\0${ID}`) return null;
      this.addWatchFile(file);
      const raw = readFileSync(file, "utf8");
      const source = /at ([0-9a-f]{7,})/.exec(raw)?.[1] ?? "unknown";
      const { md, effective, markers } = prepare(raw);
      if (markers.length && !draft) {
        this.error(
          `The privacy policy still has ${markers.length} unresolved marker(s), so it is not ready to publish:\n  ` +
            markers.join("\n  ") +
            "\nUpdate it in vorash/vora-mail and re-run scripts/sync-mail-privacy.sh, or set MAIL_PRIVACY_DRAFT=1 to review it locally.",
        );
      }
      const { html, toc } = render(md, draft);
      return `export default ${JSON.stringify({ html, toc, effective, source, draft })};`;
    },
  };
}
