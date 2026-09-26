import type { CSSProperties, ReactNode } from "react";

// The app routes on location.hash, so in-page anchors must scroll by hand
// instead of changing the hash (which would switch variants).
export function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

export function Jump({
  to,
  className,
  children,
  label,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <a
      href={`#${to}`}
      className={className}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        jumpTo(to);
      }}
    >
      {children}
    </a>
  );
}

export function Crops() {
  return (
    <>
      <span className="cp-crop cp-crop--tl" aria-hidden="true" />
      <span className="cp-crop cp-crop--tr" aria-hidden="true" />
      <span className="cp-crop cp-crop--bl" aria-hidden="true" />
      <span className="cp-crop cp-crop--br" aria-hidden="true" />
    </>
  );
}

export function Plate({
  n,
  label,
  code,
  id,
  title,
  sub,
}: {
  n: string;
  label: string;
  code: string;
  id: string;
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <header className="cp-plate">
      <div className="cp-plate__bar" data-reveal>
        <span className="cp-plate__n">§{n}</span>
        <span className="cp-plate__label">{label}</span>
        <span className="cp-plate__rule" aria-hidden="true" />
        <span className="cp-plate__code">{code}</span>
      </div>
      <h2 className="cp-h2" id={id} data-reveal>
        {title}
      </h2>
      {sub && (
        <p className="cp-sub" data-reveal>
          {sub}
        </p>
      )}
    </header>
  );
}

const barCache = new Map<string, CSSProperties>();

// A deterministic, purely decorative barcode drawn with one CSS gradient.
export function barcode(seed: string, ink = "#0B0B0A", length = 150): CSSProperties {
  const key = `${seed}|${ink}|${length}`;
  const hit = barCache.get(key);
  if (hit) return hit;
  const src = `${seed}/VORA/CTN/${seed}`;
  const stops: string[] = [];
  let x = 0;
  let i = 0;
  while (x < length) {
    const c = src.charCodeAt(i % src.length) + i * 7;
    const w = (c % 3) + 1;
    const g = ((c >> 2) % 3) + 1;
    stops.push(`${ink} ${x}px ${x + w}px`, `transparent ${x + w}px ${x + w + g}px`);
    x += w + g;
    i++;
  }
  const style = { backgroundImage: `linear-gradient(90deg, ${stops.join(", ")})`, width: `${x}px` };
  barCache.set(key, style);
  return style;
}

export function Barcode({ seed, ink, length, className = "" }: { seed: string; ink?: string; length?: number; className?: string }) {
  return <span className={`cp-bars ${className}`} style={barcode(seed, ink, length)} aria-hidden="true" />;
}

export function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

const PICTO: Record<string, ReactNode> = {
  network: (
    <>
      <circle cx="12" cy="12" r="6.5" />
      <path d="M7.4 16.6 16.6 7.4" />
    </>
  ),
  audit: <path d="M3.5 12h3.5l2-5 3 10 2.2-7 1.6 2h4.7" />,
  identity: (
    <>
      <circle cx="12" cy="9" r="3" />
      <path d="M6.5 18.5c1-3.2 3.1-4.7 5.5-4.7s4.5 1.5 5.5 4.7" />
    </>
  ),
  isolation: (
    <>
      <rect x="4.5" y="4.5" width="15" height="15" />
      <rect x="9" y="9" width="6" height="6" />
    </>
  ),
  secrets: (
    <>
      <circle cx="8" cy="12" r="3.3" />
      <path d="M11.3 12H20M17 12v3M20 12v2.4" />
    </>
  ),
  fork: (
    <>
      <circle cx="12" cy="5.5" r="2" />
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="18" cy="18.5" r="2" />
      <path d="M12 7.5V11L6 16.5M12 11l6 5.5" />
    </>
  ),
  budgets: (
    <>
      <path d="M4.5 16.5a7.5 7.5 0 0 1 15 0" />
      <path d="M12 16.5l3.6-4.6" />
      <path d="M4 19.5h16" />
    </>
  ),
  agents: <path d="M9 3.5v4.5M15 3.5v4.5M7 8h10v3.5a5 5 0 0 1-10 0zM12 16.5v4" />,
};

// A GHS-style hazard diamond with a small glyph for each containment measure.
export function Picto({ kind }: { kind: string }) {
  return (
    <svg className="cp-picto" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="9" y="9" width="30" height="30" transform="rotate(45 24 24)" className="cp-picto__frame" />
      <g transform="translate(12 12)" className="cp-picto__glyph">
        {PICTO[kind]}
      </g>
    </svg>
  );
}
