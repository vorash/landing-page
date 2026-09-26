# vora.sh landing page

The landing page for [Vora](https://github.com/vorash/vora): isolated Linux
sandboxes for AI agents and untrusted code.

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
| `src/landing/` | the page: sections, glass cube, instruments, styles, self-hosted fonts |
| `src/shared/content.ts` | every fact and number on the page — keep it traceable to the vora repos |
| `src/shared/` | hooks, the syntax highlighter, the Prism logo mark |
| `public/` | favicon, `llms.txt`, social image |

The other explored directions (Event Horizon, Containment Protocol, brand
board) live on the `design/landing-explorations` branch.
