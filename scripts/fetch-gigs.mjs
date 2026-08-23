// Regenerates src/data/gigs.json from Bohemia Stellenbosch's Quicket page.
//
// Why this runs at BUILD TIME and not in the browser:
// Quicket has no public/CORS-enabled scraping API (their real API exists
// but requires a signed-up developer API key — see docs.quicket.com), so
// a page loaded in someone's browser can't pull this from quicket.co.za
// directly. This script runs in Node during `npm run build` (locally or
// in the GitHub Actions runner) and writes a plain JSON file that the
// React app imports at build time.
//
// Why Playwright (a real headless browser) instead of a plain fetch:
// Quicket's organiser page renders its event list client-side via JS
// after the initial HTML loads — a plain fetch() only sees an empty
// shell, so it can't find any event links. Playwright actually runs the
// page's JS (same as a real browser) and reads the DOM afterwards, so it
// sees the same content a visitor does.
//
// If Quicket is unreachable, the browser fails to launch, or their
// markup changes enough that nothing parses, this script leaves the
// existing src/data/gigs.json untouched (it never writes an empty/broken
// file) and exits 0, so a bad scrape never breaks the site — it just
// quietly falls back to the last-known snapshot until the next
// successful run.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "../src/data/gigs.json");

const ORGANISER_URL =
  "https://www.quicket.co.za/organisers/90799-bohemia-stellenbosch";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

let browser;

async function getBrowser() {
  if (!browser) browser = await chromium.launch({ headless: true });
  return browser;
}

// Loads a URL in a real (headless) browser tab, waits for client-side JS
// to finish rendering, and returns the resulting HTML — unlike a plain
// fetch(), this sees whatever content Quicket's JS injects into the DOM.
async function fetchRenderedHtml(url) {
  const b = await getBrowser();
  const page = await b.newPage({ userAgent: UA });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    // Best-effort: give the network a chance to settle so lazy-rendered
    // content appears, but don't fail the whole scrape if some
    // background connection (chat widget, analytics, ads) never goes
    // fully idle — event pages in particular seem to keep something
    // open indefinitely, which made "networkidle" time out outright.
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1000);
    return await page.content();
  } finally {
    await page.close();
  }
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function absoluteUrl(url) {
  if (!url) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `https://www.quicket.co.za${url}`;
  return url;
}

function extractEventLinks(html) {
  // Matches relative ("/events/123-slug") and absolute
  // ("https://www.quicket.co.za/events/123-slug") links, single or double
  // quotes, with or without a trailing slash and/or query string (e.g.
  // Quicket appends "?ref=organiser-profile" to links on the organiser
  // page).
  const hrefRe =
    /href=["'](?:https?:\/\/(?:www\.)?quicket\.co\.za)?(\/events\/(\d+)-[a-z0-9-]+)\/?(?:\?[^"']*)?["']/gi;
  const seen = new Map();
  let m;
  while ((m = hrefRe.exec(html))) {
    const [, path, id] = m;
    if (!seen.has(id)) seen.set(id, absoluteUrl(path));
  }
  return [...seen.values()];
}

// Fallback: some SPAs embed event data as JSON (e.g. inside a
// window.__STATE__ = {...} script tag) rather than as plain <a href>
// links. This looks for "eventId":123456-style fields anywhere in the
// page and reconstructs a plausible event URL id from them.
function extractEventIdsFromEmbeddedJson(html) {
  const ids = new Set();
  const patterns = [
    /"eventId"\s*:\s*(\d{4,})/gi,
    /"EventId"\s*:\s*(\d{4,})/gi,
    /"id"\s*:\s*(\d{4,})\s*,\s*"(?:name|title|slug)"/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) ids.add(m[1]);
  }
  return [...ids];
}

// Prints a short diagnostic when nothing is found, instead of failing
// silently — this is what shows up in the console/CI logs to help figure
// out why the page's markup didn't match what we expected.
function logDiagnostics(label, html) {
  const hasChallenge =
    /just a moment|checking your browser|cf-browser-verification|captcha/i.test(
      html
    );
  const eventsMentions = (html.match(/\/events\//gi) || []).length;
  console.warn(
    `[fetch-gigs] Diagnostics for ${label}: length=${html.length}, ` +
      `possible bot-challenge=${hasChallenge}, "/events/" occurrences=${eventsMentions}`
  );
}

function metaContent(html, property) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const m = html.match(re);
  return m ? decodeEntities(m[1]) : null;
}

function extractTitle(html) {
  const og = metaContent(html, "og:title");
  if (og) return og;
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? decodeEntities(m[1]).replace(/\s*\|\s*Quicket.*$/i, "") : null;
}

// Looks for a rendered date/time range like "Thu Aug 27, 18:00 - Thu Aug 27, 23:00"
function extractDateTime(html) {
  const m = html.match(
    /\b([A-Z][a-z]{2}\s[A-Z][a-z]{2}\s\d{1,2},\s\d{2}:\d{2})\s*-\s*[A-Z][a-z]{2}\s[A-Z][a-z]{2}\s\d{1,2},\s\d{2}:\d{2}/
  );
  if (!m) return null;
  const [, start] = m;
  // "Aug 27, 18:00" -> keep weekday + day + month, drop the time for the card date line
  const dm = start.match(/^([A-Z][a-z]{2})\s([A-Z][a-z]{2})\s(\d{1,2}),/);
  if (!dm) return null;
  const [, weekday, month, day] = dm;
  return `${weekday} ${day} ${month}`;
}

function extractPrice(html) {
  const m = html.match(/From\s+R\s?[\d,]+/i);
  return m ? m[0].replace(/\s+/g, " ") : null;
}

function extractDescriptionSnippet(html) {
  const desc = metaContent(html, "og:description") || metaContent(html, "description");
  if (!desc) return null;
  return desc.length > 220 ? `${desc.slice(0, 217)}...` : desc;
}

// Splits "A, B, C, D - LIVE at Bohemia Stellenbosch" into a "bands" line
function extractBandsFromTitle(title) {
  const cleaned = title
    .replace(/\s*[-–]\s*(LIVE|Live)\s+at\s+Bohemia.*$/i, "")
    .trim();
  return cleaned;
}

async function scrapeEvent(url) {
  const html = await fetchRenderedHtml(url);
  const rawTitle = extractTitle(html) || "Live at Bohemia Stellenbosch";
  const image = absoluteUrl(metaContent(html, "og:image"));
  const date = extractDateTime(html) || "See Quicket for date";
  const price = extractPrice(html);
  const bands = extractBandsFromTitle(rawTitle);
  const desc = extractDescriptionSnippet(html);

  const detailParts = [];
  if (desc) detailParts.push(desc);
  if (price) detailParts.push(`Tickets ${price}.`);

  return {
    tag: "Next up",
    date,
    title: rawTitle.replace(/\s*[-–]\s*(LIVE|Live)\s+at\s+Bohemia.*$/i, "").trim(),
    bands,
    detail: detailParts.join(" ") || "See Quicket for full details.",
    href: url,
    cta: "Get Tickets",
    image: image || null,
  };
}

async function main() {
  let gigs = [];

  try {
    const organiserHtml = await fetchRenderedHtml(ORGANISER_URL);
    let eventUrls = extractEventLinks(organiserHtml);

    if (eventUrls.length === 0) {
      // Try the embedded-JSON fallback before giving up.
      const ids = extractEventIdsFromEmbeddedJson(organiserHtml);
      if (ids.length > 0) {
        console.warn(
          `[fetch-gigs] No <a href> links matched, but found ${ids.length} event id(s) in embedded JSON: ${ids.join(", ")}`
        );
      }

      logDiagnostics("organiser page", organiserHtml);
      await writeFile(
        path.join(__dirname, "../.debug-organiser.html"),
        organiserHtml,
        "utf-8"
      ).catch(() => {});
      console.warn(
        "[fetch-gigs] Dumped rendered HTML to scripts/../.debug-organiser.html for inspection."
      );

      throw new Error("No event links found on organiser page.");
    }

    gigs = await Promise.all(
      eventUrls.map((url) =>
        scrapeEvent(url).catch((err) => {
          console.warn(`[fetch-gigs] Skipping ${url}: ${err.message}`);
          return null;
        })
      )
    ).then((results) => results.filter(Boolean));

    // First card is styled as "Next up", rest as weekly/upcoming style.
    gigs.forEach((g, i) => {
      if (i > 0) g.tag = "Upcoming";
    });

    if (gigs.length === 0) {
      throw new Error("All event pages failed to parse.");
    }
  } catch (err) {
    console.warn(
      `[fetch-gigs] Live scrape failed (${err.message}). Keeping existing src/data/gigs.json unchanged.`
    );
    return;
  } finally {
    if (browser) await browser.close();
  }

  await writeFile(OUT_PATH, `${JSON.stringify(gigs, null, 2)}\n`, "utf-8");
  console.log(`[fetch-gigs] Wrote ${gigs.length} event(s) to ${OUT_PATH}`);
}

main().catch((err) => {
  console.warn(`[fetch-gigs] Unexpected error, leaving gigs.json as-is: ${err.message}`);
});