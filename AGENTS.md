# AGENTS.md

Landing page for Vora (vora.sh): a single-page Vite 6 + React 18 site, plain CSS, no UI framework.

## Commands

- Package manager is **yarn classic** (`yarn.lock`). If `yarn` isn't installed, use `npx yarn@1 …`; don't create a `package-lock.json`.
- `yarn dev` serves on port 3000 and opens a browser (`vite.config.ts`). If 3000 is taken: `npx vite --port 5317`.
- `yarn build` writes to `build/` (not `dist/`).
- `yarn build` fails while Vora Mail's privacy policy (`src/mail/privacy-policy.md`) still has `[OWNER: …]`, `[LEGAL: …]` or `[PLACEHOLDER]` markers, so a draft policy can never be published. `MAIL_PRIVACY_DRAFT=1 yarn build` builds anyway and highlights them, for local review only. `yarn dev` errors on `/mail/privacy` for the same reason; run `MAIL_PRIVACY_DRAFT=1 yarn dev`. The policy lives in vorash/vora-mail; refresh the copy with `scripts/sync-mail-privacy.sh [ref]`, never edit it here.
- There is no test suite, linter or `tsconfig`. Vite's SWC plugin does **not** type-check, so type errors won't fail the build. Verify with `yarn build` plus a look in a browser at desktop and ~390px width, in both themes.

## Layout

- `src/App.tsx` renders `src/landing/CleanRoom.tsx`, the whole page. `GlassCube.tsx` is the hero, `Instruments.tsx` the feature panels.
- `src/shared/content.ts` holds **every fact, number and code sample** on the page.
- `mail/` and `src/mail/` are the Vora Mail page (`/mail/`) and its privacy policy (`/mail/privacy`, rendered at build time by `tools/privacy-policy.ts`). `legal/` and `src/legal/` are the site's legal notice (`/legal`). `src/shared/DocPage.tsx` is the long-form layout both use. Google's OAuth verification points at `/mail/`, `/mail/privacy` and `/legal` on www.vora.sh: never move them.
- The other design directions (Event Horizon, Containment Protocol, brand board) live only on the `design/landing-explorations` branch.

## Content rules

- Every claim must trace to the sibling repos `../vora` (README, `docs/adr/`, `docs/benchmarks/`), `../vora-probe` and, for Vora Mail, `../vora-mail` (README, `docs/`). Vora Mail's media comes from `../vora-mail-promotional/videos/hero/`, copied under the same names. Never invent customers, uptime, regions or benchmarks. The old site did, and that was the reason for the rewrite.
- Vora is v0.7, a proof of concept. Keep the stated limits and FAQ honest.
- Avoid competitors' taglines: "a computer for every agent", "code you didn't write". Don't lead with cold-start time (1.1s loses to rivals); lead with exec latency, density and "no KVM, no Kubernetes".
- The waitlist form has no backend: it opens the visitor's mail app with a message to contact@vora.sh (`mailto:`). Vora Mail's privacy policy §13 and `/legal` describe it, so change them together.

## Styling and themes

- All selectors are scoped under `.cr` in `src/landing/cleanroom.css`.
- Day/night theme is `data-theme` on the `.cr` root. **Never hard-code colours**: use the tokens defined at the top of `cleanroom.css`, overridden in `.cr[data-theme="night"]`.
  - Translucent colours use channel tokens: `rgb(var(--ink-rgb) / 0.07)`, `rgb(var(--glass) / 0.8)`, `rgb(var(--bg-rgb) / …)`, `rgb(var(--cool) / …)`.
  - Shadows: `rgb(var(--shade) / calc(a * var(--shade-a)))`. White highlights: `rgb(255 255 255 / calc(a * var(--hi-a)))`.
  - Text on accent or colour fills uses `var(--on-accent)`; text on ink fills uses `var(--on-ink)`. Night accent `#7d98ff` is too light for white text.
- The theme storage key `vora-cr-theme` is in `src/shared/theme.ts` and in the inline no-flash script of every HTML entry (`index.html`, `probe/`, `mail/`, `mail/privacy/`, `legal/`); change them together.
- Fonts (Switzer, Fragment Mono) are self-hosted in `src/landing/fonts/` via `fonts.css`. Don't add font CDNs; the page makes no third-party requests.
- Keep `prefers-reduced-motion` support when adding animation (`useReducedMotion` in `src/shared/hooks.ts`, plus CSS).

## Branding

- `branding/` is generated: run `branding/source/render.sh` (needs python3, `rsvg-convert`, ImageMagick) instead of editing SVG/PNG by hand. The wordmark comes from pre-outlined glyphs in `branding/source/switzer-600-vora.json`.
- Social cards come from `branding/source/og.html` (append `?night` for the dark card), screenshotted at 1200×630.
- `public/og-image.png`, `public/apple-touch-icon.png` and `public/favicon.ico` are copies of kit files. Re-copy them after regenerating. `public/favicon.svg` is hand-written (it has a dark-mode media query).
- The logo mark in the page is `MarkPrism` in `src/shared/logos.tsx`; keep it in sync with `gen_svg.py` if the geometry changes.
- Vora Mail's pages (`/mail/`, `/mail/privacy`) use Vora Mail's own app icon, `MarkMail`, from `public/mail/vora-mail-icon.svg`. It is a copy of `assets/icons/scalable/apps/dev.vora.Mail.svg` in vorash/vora-mail, and the `-32.png` and `-apple-touch-icon.png` beside it are rendered from it with `rsvg-convert`. Vora Mail will move to a domain of its own: keep its pages free of links into the rest of vora.sh, and route its own links through `MAIL_LINKS`.

## Git

- Work on a branch and open a PR against `main`. Commits are signed (already configured) and follow `type(scope): summary`, e.g. `feat(landing): …`, `feat(brand): …`, `chore(landing): …`, with the body explaining why.
