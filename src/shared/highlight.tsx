import type { ReactNode } from "react";

const KEYWORDS = new Set([
  "import", "from", "const", "await", "async", "with", "as", "try", "finally",
  "new", "return", "for", "of", "if", "print", "def", "let",
]);

// Just enough tokenizing for the landing-page snippets: prompts, comments,
// strings, keywords, flags and numbers. Class names are prefixed `tk-`.
export function highlight(code: string): ReactNode[] {
  // In a shell transcript, lines without a prompt are program output.
  const transcript = /^\$ /m.test(code);
  return code.split("\n").map((line, li) => {
    if (transcript && !line.startsWith("$ ") && !/^\s*(#|\s{2,}--)/.test(line)) {
      return (
        <span key={li} className="tk-line">
          <span className="tk-out">{line}</span>
          {"\n"}
        </span>
      );
    }
    const out: ReactNode[] = [];
    let rest = line;
    let k = 0;
    const push = (cls: string | null, text: string) => {
      out.push(cls ? <span key={k++} className={cls}>{text}</span> : <span key={k++}>{text}</span>);
    };
    if (/^\s*(#|\/\/)/.test(rest)) {
      push("tk-com", rest);
      rest = "";
    }
    if (rest.startsWith("$ ")) {
      push("tk-prompt", "$ ");
      rest = rest.slice(2);
    }
    const re = /("[^"]*"|'[^']*'|`[^`]*`|\/\/.*$|--?[a-zA-Z][\w-]*|\b\d+(?:\.\d+)?(?:ms|m|s|Mi|Gi)?\b|\b[A-Za-z_]\w*\b|[^\s\w]+|\s+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(rest))) {
      const t = m[0];
      if (/^["'`]/.test(t)) push("tk-str", t);
      else if (t.startsWith("//")) push("tk-com", t);
      else if (/^--?[a-zA-Z]/.test(t)) push("tk-flag", t);
      else if (/^\d/.test(t)) push("tk-num", t);
      else if (KEYWORDS.has(t)) push("tk-kw", t);
      else if (/^(vora|claude|node|python3?|pip|npm)$/.test(t) && out.length <= 2) push("tk-cmd", t);
      else push(null, t);
    }
    return (
      <span key={li} className="tk-line">
        {out}
        {"\n"}
      </span>
    );
  });
}
