// Bakes real, crawlable HTML into dist/index.html after `vite build`.
//
// WHY THIS EXISTS:
// This is a pure client-side-rendered React app — vite build only
// produces a static shell (<div id="root"></div> + a script tag). A
// browser fills that in fine, but anything that reads the raw HTML
// without running JS (search engine crawlers, SEO checkers, link
// unfurlers that don't execute scripts) sees an empty page: no <h1>,
// no headings, no text, no internal links — even though the React tree
// has all of that once it mounts.
//
// HOW IT WORKS:
// 1. Serve the freshly-built dist/ folder from a throwaway local static
//    server (respecting the same base path Vite baked into the build —
//    "/Bohemia_Website/" on GitHub Pages, "/" on Cloudflare Pages).
// 2. Load that URL in a real headless browser (Playwright/Chromium) and
//    wait for the app to actually mount.
// 3. Grab the fully-rendered DOM (page.content()) and overwrite
//    dist/index.html with it. The original <script type="module"> tag
//    stays in place, so real visitors' browsers still load and run the
//    app as normal — this just means the *initial* HTML already has
//    real content painted in, instead of an empty shell.
//
// FAILURE MODE: same philosophy as fetch-gigs.mjs — if anything here
// fails (browser won't launch, app doesn't mount in time, etc.), this
// script logs a warning and exits 0 without touching dist/. A failed
// prerender should never break the deploy; it just means that build's
// HTML is the plain client-rendered shell instead of the enhanced one,
// same as before this script existed.

import { chromium } from "playwright";
import http from "node:http";
import { readFile as fsReadFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "../dist");

// Mirrors the base-path logic in vite.config.js — must stay in sync.
const BASE = process.env.GITHUB_PAGES === "true" ? "/Bohemia_Website/" : "/";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Minimal static file server for dist/, aware of Vite's base path so
// requests like GET /Bohemia_Website/assets/index-XXXX.js resolve to
// dist/assets/index-XXXX.js.
function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

      if (BASE !== "/" && urlPath.startsWith(BASE)) {
        urlPath = urlPath.slice(BASE.length - 1); // keep one leading slash
      }
      if (urlPath === "/" || urlPath === "") urlPath = "/index.html";

      const filePath = path.join(DIST_DIR, urlPath);

      // Guard against escaping dist/ via a crafted path.
      if (!filePath.startsWith(DIST_DIR)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
        res.end(data);
      });
    });

    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function main() {
  // If there's no build output yet, there's nothing to prerender.
  try {
    await fsReadFile(path.join(DIST_DIR, "index.html"), "utf-8");
  } catch {
    console.warn("[prerender] No dist/index.html found (did `vite build` run first?). Skipping.");
    return;
  }

  let server;
  let browser;
  try {
    server = await startStaticServer();
    const { port } = server.address();
    const url = `http://127.0.0.1:${port}${BASE}`;

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    // Wait for the real app content to mount — the Hero section's <h1>
    // is the first thing React renders, so its presence means the tree
    // has committed and there's real markup to capture.
    await page.waitForSelector(".hero__title", { timeout: 15000 });
    // Best-effort: let images/fonts/late layout settle before capturing.
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});

    const html = await page.content();
    const outPath = path.join(DIST_DIR, "index.html");
    await fs.promises.writeFile(outPath, html, "utf-8");
    console.log(`[prerender] Wrote fully-rendered markup to ${outPath}`);
  } catch (err) {
    console.warn(
      `[prerender] Skipped (${err.message}). dist/index.html remains the plain client-rendered shell for this build.`
    );
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
  }
}

main();
