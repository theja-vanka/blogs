#!/usr/bin/env node
/**
 * Import Quarto-rendered HTML into Next.js content files.
 *
 * Usage: npm run import
 *   Reads  : ../blogs/docs/posts/  (relative to this project root)
 *   Writes : content/posts/*.json  (metadata + article HTML)
 *            public/search-index.json
 *            public/posts/[slug]/  (copied images)
 *            app/favicon.ico       (copied from docs root)
 *            public/profile.jpg    (copied from docs root)
 *
 * Override source path: QUARTO_DOCS_PATH=../path/to/docs/posts npm run import
 */

import { load } from "cheerio";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QUARTO_DOCS = process.env.QUARTO_DOCS_PATH
  ? path.resolve(ROOT, process.env.QUARTO_DOCS_PATH)
  : path.resolve(ROOT, "../blogs/docs/posts");
const QUARTO_ROOT = path.resolve(QUARTO_DOCS, ".."); // docs/ root (has favicon, profile.jpg)
const CONTENT_DIR = path.resolve(ROOT, "content/posts");
const PUBLIC_POSTS = path.resolve(ROOT, "public/posts");

// ─── helpers ─────────────────────────────────────────────────────────────────

async function findHtmlFiles(dir, base = dir) {
  const results = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findHtmlFiles(fullPath, base)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      results.push(path.relative(base, fullPath));
    }
  }
  return results;
}

function slugFromPath(relPath) {
  return relPath
    .replace(/\.html$/, "")
    .replace(/\/index$/, "")
    .replace(/_/g, "-")
    .toLowerCase();
}

function slugToFileName(slugPath) {
  return slugPath.replace(/\//g, "__") + ".json";
}

function estimateReadingTime(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return { wordCount: words, readingTime: Math.max(1, Math.round(words / 200)) };
}

function extractHeadings($, container) {
  const headings = [];
  // Quarto uses data-anchor-id rather than id on heading elements.
  // Copy it to id so both TOC links and in-page anchors work.
  container.find("h2[data-anchor-id], h3[data-anchor-id]").each((_, el) => {
    const id = $(el).attr("data-anchor-id") || "";
    $(el).attr("id", id);
    const text = $(el).clone().find(".anchor, a.anchorjs-link").remove().end().text().trim();
    if (id && text) {
      headings.push({ level: el.name === "h2" ? 2 : 3, text, id });
    }
  });
  return headings;
}

async function copyImages($, container, sourceDir, slugPath) {
  const destDir = path.join(PUBLIC_POSTS, slugPath);
  const updates = [];

  container.find("img[src]").each((_, el) => {
    const src = $(el).attr("src") || "";
    if (src.startsWith("http") || src.startsWith("/") || src.startsWith("data:")) return;
    updates.push({ el, src });
  });

  if (updates.length === 0) return;

  await fs.ensureDir(destDir);

  for (const { el, src } of updates) {
    const srcPath = path.resolve(sourceDir, decodeURIComponent(src));
    const basename = path.basename(src);
    const destPath = path.join(destDir, basename);
    try {
      await fs.copy(srcPath, destPath, { overwrite: true });
      $(el).attr("src", `/posts/${slugPath}/${basename}`);
    } catch {
      // Image not found — keep original src
    }
  }
}

function cleanContent($, container) {
  // Remove Quarto navigation artifacts
  container.find(".code-copy-button, #quarto-sidebar, .quarto-navigation-tool").remove();
  container.find("script").remove();
  // Remove anchor-link spans Quarto adds to headings
  container.find(".anchor-section").remove();
  container.find("a.anchorjs-link").remove();
  // Remove the first h1 — it duplicates the title we render in the page header
  container.find("h1").first().remove();
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!(await fs.pathExists(QUARTO_DOCS))) {
    console.error(`\n❌  Quarto docs not found at: ${QUARTO_DOCS}`);
    console.error(`    Run 'quarto render' first, or set QUARTO_DOCS_PATH env var.\n`);
    process.exit(1);
  }

  // Clean previous content
  await fs.emptyDir(CONTENT_DIR);
  await fs.ensureDir(PUBLIC_POSTS);

  const htmlFiles = await findHtmlFiles(QUARTO_DOCS);
  console.log(`\nFound ${htmlFiles.length} HTML files in ${QUARTO_DOCS}\n`);

  const allPosts = [];

  for (const relPath of htmlFiles) {
    const absolutePath = path.join(QUARTO_DOCS, relPath);
    const slugPath = slugFromPath(relPath);
    const slugParts = slugPath.split("/");
    const sourceDir = path.dirname(absolutePath);

    let html;
    try {
      html = await fs.readFile(absolutePath, "utf-8");
    } catch {
      console.warn(`  ⚠  Could not read ${relPath}`);
      continue;
    }

    const $ = load(html);

    // ── Metadata ──────────────────────────────────────────────────
    const title =
      $("h1.title").first().text().trim() ||
      $("meta[property='og:title']").attr("content") ||
      $("title").text().replace(/\s*[–—-]\s*.*$/, "").trim() ||
      slugParts[slugParts.length - 1];

    const author =
      $("meta[name='author']").attr("content") ||
      $(".quarto-title-meta-contents p").first().text().trim() ||
      "Krishnatheja Vanka";

    const date =
      $("meta[name='dcterms.date']").attr("content") ||
      $("p.date").first().text().trim() ||
      "";

    const description =
      $("meta[property='og:description']").attr("content") ||
      $("meta[name='description']").attr("content") ||
      $(".description.abstract-description p").first().text().trim() ||
      "";

    const categories = [];
    $(".quarto-category").each((_, el) => {
      const cat = $(el).text().trim();
      if (cat) categories.push(cat);
    });

    // ── Content ───────────────────────────────────────────────────
    const main = $("main#quarto-document-content").first();

    if (!main.length) {
      console.warn(`  ⚠  No main#quarto-document-content in ${relPath} — skipping`);
      continue;
    }

    cleanContent($, main);
    await copyImages($, main, sourceDir, slugPath);

    const headings = extractHeadings($, main);
    const hasMermaid = main.find("pre.mermaid-js").length > 0;
    const hasMath = main.find(".math").length > 0;
    const { wordCount, readingTime } = estimateReadingTime(main.text());
    const content = main.html() || "";

    const post = {
      slug: slugParts,
      slugPath,
      title,
      author,
      date,
      description,
      categories,
      readingTime,
      wordCount,
      headings,
      hasMermaid,
      hasMath,
      content,
    };

    await fs.outputJSON(path.join(CONTENT_DIR, slugToFileName(slugPath)), post);

    allPosts.push({ slug: slugParts, slugPath, title, author, date, description, categories, readingTime, wordCount });
    console.log(`  ✓  ${slugPath}`);
  }

  // Sort newest first
  allPosts.sort((a, b) => {
    const ta = a.date ? new Date(a.date).getTime() : 0;
    const tb = b.date ? new Date(b.date).getTime() : 0;
    return tb - ta;
  });

  await fs.outputJSON(path.join(CONTENT_DIR, "_index.json"), allPosts, { spaces: 2 });

  // Search index (title + description + categories only — no full content)
  const searchIndex = allPosts.map((p, i) => ({
    id: i,
    title: p.title,
    description: p.description,
    categories: p.categories.join(", "),
    slug: p.slugPath,
  }));
  await fs.outputJSON(path.resolve(ROOT, "public/search-index.json"), searchIndex, { spaces: 2 });

  // ── Root site assets ──────────────────────────────────────────────────────
  const rootAssets = [
    { src: "favicon.ico",  dest: path.join(ROOT, "app/favicon.ico") },
    { src: "profile.jpg",  dest: path.join(ROOT, "public/profile.jpg") },
  ];
  for (const { src, dest } of rootAssets) {
    const srcPath = path.join(QUARTO_ROOT, src);
    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, dest, { overwrite: true });
      console.log(`  ✓  ${src} → ${path.relative(ROOT, dest)}`);
    }
  }

  console.log(`\n✅  Imported ${allPosts.length} posts`);
  console.log(`    Content : ${CONTENT_DIR}`);
  console.log(`    Search  : ${ROOT}/public/search-index.json`);
  console.log(`\n    Next: npm run dev   (local preview)`);
  console.log(`          npm run build  (production build)\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
