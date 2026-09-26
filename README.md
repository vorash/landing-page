# vora.sh landing page

The landing page for [Vora](https://github.com/vorash/vora): isolated Linux
sandboxes for AI agents and untrusted code. A separate `/probe/` page introduces
[Vora Probe](https://github.com/vorash/vora-probe), the read-only investigator.

Vite + React, plain CSS, no UI framework. Day and night themes; the visitor's
choice is stored in `localStorage` (`vora-cr-theme`) and defaults to the OS
setting. Press `n` to toggle.

## Run

```bash
yarn install
yarn dev        # http://localhost:3000
yarn build      # static site in build/
```

## Layout

| Path | What |
| --- | --- |
| `src/landing/` | the Vora page: sections, glass cube, instruments, styles, self-hosted fonts |
| `probe/index.html`, `src/probe/` | the separate Probe page and its entry point; Vite builds `build/probe/index.html` |
| `src/shared/content.ts` | every fact and number on the page — keep it traceable to the vora repos |
| `src/shared/` | content, theme, hooks, the syntax highlighter, the Prism logo mark |
| `public/` | favicon, `llms.txt`, social image |

The other explored directions (Event Horizon, Containment Protocol, brand
board) live on the `design/landing-explorations` branch.
