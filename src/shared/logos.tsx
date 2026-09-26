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

/** Prism — an isometric box whose top face draws the V: the sandbox itself. */
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
