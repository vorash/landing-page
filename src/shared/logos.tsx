import { useId, type SVGProps } from "react";

type MarkProps = SVGProps<SVGSVGElement> & {
  size?: number;
  // "gradient" uses the mark's own brand gradient; "mono" draws in currentColor.
  tone?: "gradient" | "mono";
  from?: string;
  to?: string;
};

function Svg({ size = 32, children, ...rest }: MarkProps & { children: React.ReactNode }) {
  const { tone: _t, from: _f, to: _g, ...svg } = rest;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" {...svg}>
      {children}
    </svg>
  );
}

function useStroke(tone: MarkProps["tone"], from: string, to: string) {
  const id = useId().replace(/:/g, "");
  const def =
    tone === "mono" ? null : (
      <defs>
        <linearGradient id={id} x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
    );
  return [def, tone === "mono" ? "currentColor" : `url(#${id})`] as const;
}

/** A · Trace — the current circuit-trace V, redrawn on a strict geometric grid. */
export function MarkTrace({ tone = "gradient", from = "#2F5BFF", to = "#19D3FF", ...p }: MarkProps) {
  const [def, paint] = useStroke(tone, from, to);
  return (
    <Svg {...p}>
      {def}
      <g stroke={paint} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 12 H18 L36 50 L54 12" />
        <path d="M16 24 H23.7" />
        <path d="M22 36 H29.4" />
      </g>
      <g fill={paint}>
        <circle cx="6" cy="12" r="3.2" />
        <circle cx="9" cy="24" r="3.2" />
        <circle cx="15" cy="36" r="3.2" />
      </g>
    </Svg>
  );
}

/** B · Horizon — a ring open at the top; the V falls into the singularity. */
export function MarkHorizon({ tone = "gradient", from = "#FFB36B", to = "#FF4D1A", ...p }: MarkProps) {
  const [def, paint] = useStroke(tone, from, to);
  return (
    <Svg {...p}>
      {def}
      <path d="M47.6 21.95 A21 21 0 1 1 16.4 21.95" stroke={paint} strokeWidth="5" strokeLinecap="round" />
      <path d="M16 4 L32 38 L48 4" stroke={paint} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** C · Cell — registration brackets around a V: the specimen under containment. */
export function MarkCell({ tone = "gradient", from = "#D8FF3C", to = "#9BEA00", ...p }: MarkProps) {
  const [def, paint] = useStroke(tone, from, to);
  return (
    <Svg {...p}>
      {def}
      <g stroke={paint} strokeWidth="4.5" strokeLinecap="square">
        <path d="M8 20 V8 H20" />
        <path d="M44 8 H56 V20" />
        <path d="M56 44 V56 H44" />
        <path d="M20 56 H8 V44" />
      </g>
      <path
        d="M20 20 L32 44 L44 20"
        stroke={paint}
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

/** D · Fork — one state, two timelines, a ghost third: snapshot & fork as a V. */
export function MarkFork({ tone = "gradient", from = "#8A7CFF", to = "#20D6C7", ...p }: MarkProps) {
  const [def, paint] = useStroke(tone, from, to);
  return (
    <Svg {...p}>
      {def}
      <path d="M32 47 V17" stroke={paint} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6" opacity="0.7" />
      <g stroke={paint} strokeWidth="5" strokeLinecap="round">
        <path d="M29.6 47.6 L16.4 18.4" />
        <path d="M34.4 47.6 L47.6 18.4" />
      </g>
      <circle cx="32" cy="52" r="5.5" fill={paint} />
      <circle cx="14" cy="13" r="5" stroke={paint} strokeWidth="4" />
      <circle cx="50" cy="13" r="5" stroke={paint} strokeWidth="4" />
    </Svg>
  );
}

/** E · Prism — an isometric box whose top face draws the V: the sandbox itself. */
export function MarkPrism({ tone = "gradient", from = "#2B59FF", to = "#9A6BFF", ...p }: MarkProps) {
  const [def, paint] = useStroke(tone, from, to);
  return (
    <Svg {...p}>
      {def}
      <path d="M8.6 18.5 L32 5 L55.4 18.5 L32 32 Z" fill={paint} opacity="0.16" />
      <g stroke={paint} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M32 5 L55.4 18.5 V45.5 L32 59 L8.6 45.5 V18.5 Z" />
        <path d="M8.6 18.5 L32 32 L55.4 18.5" strokeWidth="6" />
      </g>
    </Svg>
  );
}

export const MARKS = [
  {
    key: "trace",
    name: "Trace",
    Mark: MarkTrace,
    story: "Evolution of today's logo. Same circuit-trace V and dot terminals, rebuilt on a 64-grid so it survives 16px.",
    pairs: "Clean Room",
  },
  {
    key: "horizon",
    name: "Horizon",
    Mark: MarkHorizon,
    story: "A V dropping through the open top of a ring and never coming back out. Vorāre: to swallow whole.",
    pairs: "Event Horizon",
  },
  {
    key: "cell",
    name: "Cell",
    Mark: MarkCell,
    story: "Registration brackets around a V. The specimen, framed and contained. Reads as [v] in a terminal.",
    pairs: "Containment",
  },
  {
    key: "fork",
    name: "Fork",
    Mark: MarkFork,
    story: "One state, two timelines, a ghost third. Snapshot & fork drawn as the letter itself.",
    pairs: "Probe (sub-mark)",
  },
  {
    key: "prism",
    name: "Prism",
    Mark: MarkPrism,
    story: "An isometric box whose top face draws the V. Literally a sandbox; strongest as an app icon.",
    pairs: "Clean Room",
  },
] as const;
