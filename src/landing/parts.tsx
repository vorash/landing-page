import type { ReactNode } from "react";

export function SecHead({
  n,
  label,
  title,
  sub,
  align = "left",
}: {
  n: string;
  label: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`cr-sechead cr-sechead--${align}`} data-reveal>
      <p className="cr-sechead__bar">
        <span className="cr-sechead__n">{n}</span>
        <span className="cr-sechead__label">{label}</span>
      </p>
      <h2 className="cr-h2">{title}</h2>
      {sub && <p className="cr-sub">{sub}</p>}
    </div>
  );
}

export function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="cr-arrow">
      <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function ProtocolIcon({ kind }: { kind: "gown" | "enter" | "observe" | "decon" }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      {kind === "gown" && (
        <g {...common}>
          <circle cx="12" cy="5.5" r="2.6" />
          <path d="M6.5 21v-7.5a5.5 5.5 0 0 1 11 0V21" />
          <path d="M9.5 21v-5M14.5 21v-5M6.5 15.5h-2M17.5 15.5h2" />
        </g>
      )}
      {kind === "enter" && (
        <g {...common}>
          <path d="M9 3.5h10v17H9" />
          <path d="M3 12h10M10 8.5 13.5 12 10 15.5" />
        </g>
      )}
      {kind === "observe" && (
        <g {...common}>
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="3" />
        </g>
      )}
      {kind === "decon" && (
        <g {...common}>
          <path d="M12 3v3M5.5 10.5a6.5 3.5 0 0 1 13 0Z" />
          <path d="M8 14l-1 2.5M12 14v2.5M16 14l1 2.5M9.5 19l-.5 1.5M14.5 19l.5 1.5" />
        </g>
      )}
    </svg>
  );
}
