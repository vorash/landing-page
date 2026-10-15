import { existsSync } from "fs";
import path from "path";
import type { Connect, Plugin } from "vite";

// Vercel serves mail/privacy/index.html at /mail/privacy, the URL registered
// with Google. Vite's dev and preview servers only find it with a trailing
// slash and otherwise fall back to the home page; this makes them match Vercel.
export function dirIndex(): Plugin {
  const rewrite = (root: string): Connect.NextHandleFunction => (req, _res, next) => {
    const [p, query] = (req.url ?? "").split("?");
    if (p && !p.endsWith("/") && !path.extname(p) && existsSync(path.join(root, p, "index.html"))) {
      req.url = `${p}/${query ? `?${query}` : ""}`;
    }
    next();
  };
  return {
    name: "dir-index",
    configureServer(server) {
      server.middlewares.use(rewrite(server.config.root));
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite(path.resolve(server.config.root, server.config.build.outDir)));
    },
  };
}
