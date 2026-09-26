import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export type Theme = "day" | "night";
const THEME_KEY = "vora-cr-theme";

function initialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "day" || saved === "night") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
}

// Keep the key in sync with the no-flash scripts in index.html and probe/index.html.
export function useTheme(reduced: boolean) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggle = (origin?: { x: number; y: number }) => {
    const next: Theme = theme === "day" ? "night" : "day";
    const apply = () => flushSync(() => setTheme(next));
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (!doc.startViewTransition || reduced) return apply();
    const x = origin?.x ?? window.innerWidth - 80;
    const y = origin?.y ?? 32;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    doc.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  return { theme, toggle };
}
