# AGENTS.md

Landing page for Vora (vora.sh): a single-page Vite 6 + React 18 site, plain CSS, no UI framework.

## Commands

- Package manager is **yarn classic** (`yarn.lock`). If `yarn` isn't installed, use `npx yarn@1 …`; don't create a `package-lock.json`.
- `yarn dev` serves on port 3000 and opens a browser (`vite.config.ts`). If 3000 is taken: `npx vite --port 5317`.
- `yarn build` writes to `build/` (not `dist/`).
- There is no test suite, linter or `tsconfig`. Vite's SWC plugin does **not** type-check, so type errors won't fail the build. Verify with `yarn build` plus a look in a browser at desktop and ~390px width, in both themes.

## Layout

- `src/App.tsx` renders `src/landing/CleanRoom.tsx`, the whole page. `GlassCube.tsx` is the hero, `Instruments.tsx` the feature panels.
- `src/shared/content.ts` holds **every fact, number and code sample** on the page.
- The other design directions (Event Horizon, Containment Protocol, brand board) live only on the `design/landing-explorations` branch.

## Content rules

- Every claim must trace to the sibling repos `../vora` (README, `docs/adr/`, `docs/benchmarks/`) and `../vora-probe`. Never invent customers, uptime, regions or benchmarks. The old site did, and that was the reason for the rewrite.
- Vora is v0.7, a proof of concept. Keep the stated limits and FAQ honest.
- Avoid competitors' taglines: "a computer for every agent", "code you didn't write". Don't lead with cold-start time (1.1s loses to rivals); lead with exec latency, density and "no KVM, no Kubernetes".
- The waitlist form has no backend yet; it only shows a local success state.

## Styling and themes

- All selectors are scoped under `.cr` in `src/landing/cleanroom.css`.
- Day/night theme is `data-theme` on the `.cr` root. **Never hard-code colours**: use the tokens defined at the top of `cleanroom.css`, overridden in `.cr[data-theme="night"]`.
  - Translucent colours use channel tokens: `rgb(var(--ink-rgb) / 0.07)`, `rgb(var(--glass) / 0.8)`, `rgb(var(--bg-rgb) / …)`, `rgb(var(--cool) / …)`.
  - Shadows: `rgb(var(--shade) / calc(a * var(--shade-a)))`. White highlights: `rgb(255 255 255 / calc(a * var(--hi-a)))`.
  - Text on accent or colour fills uses `var(--on-accent)`; text on ink fills uses `var(--on-ink)`. Night accent `#7d98ff` is too light for white text.
- The theme storage key `vora-cr-theme` is duplicated in `CleanRoom.tsx` and the inline no-flash script in `index.html`; change both together.
- Fonts (Switzer, Fragment Mono) are self-hosted in `src/landing/fonts/` via `fonts.css`. Don't add font CDNs; the page makes no third-party requests.
- Keep `prefers-reduced-motion` support when adding animation (`useReducedMotion` in `src/shared/hooks.ts`, plus CSS).

## Branding

- `branding/` is generated: run `branding/source/render.sh` (needs python3, `rsvg-convert`, ImageMagick) instead of editing SVG/PNG by hand. The wordmark comes from pre-outlined glyphs in `branding/source/switzer-600-vora.json`.
- Social cards come from `branding/source/og.html` (append `?night` for the dark card), screenshotted at 1200×630.
- `public/og-image.png`, `public/apple-touch-icon.png` and `public/favicon.ico` are copies of kit files. Re-copy them after regenerating. `public/favicon.svg` is hand-written (it has a dark-mode media query).
- The logo mark in the page is `MarkPrism` in `src/shared/logos.tsx`; keep it in sync with `gen_svg.py` if the geometry changes.

## Git

- Work on a branch and open a PR against `main`. Commits are signed (already configured) and follow `type(scope): summary`, e.g. `feat(landing): …`, `feat(brand): …`, `chore(landing): …`, with the body explaining why.
