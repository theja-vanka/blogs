#!/usr/bin/env node
/**
 * Deploy the Next.js blog to GitHub Pages.
 *
 * Usage: npm run deploy
 *
 * What it does (mirrors `quarto publish gh-pages`):
 *   1. Validates git + remote prerequisites
 *   2. Auto-detects basePath from the repo name
 *   3. Builds the Next.js static export
 *   4. Pushes the `out/` directory to the `gh-pages` branch
 *
 * Prerequisites:
 *   git init
 *   git remote add origin https://github.com/<user>/<repo>.git
 */

import { execSync, spawnSync } from "child_process";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import path from "path";

const require = createRequire(import.meta.url);
const ghpages = require("gh-pages");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─── Git helpers ─────────────────────────────────────────────────────────────

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf-8", ...opts }).trim();
}

function getRemoteUrl() {
  try { return run("git remote get-url origin"); } catch { return null; }
}

function isGitRepo() {
  try { run("git rev-parse --git-dir"); return true; } catch { return false; }
}

// Supports HTTPS and SSH remote URLs:
//   https://github.com/user/repo.git   → { user, repo }
//   git@github.com:user/repo.git       → { user, repo }
function parseRemote(url) {
  const m = url.match(/[:/]([^/:]+)\/([^/]+?)(?:\.git)?$/);
  return m ? { user: m[1], repo: m[2] } : null;
}

// ─── Preflight checks ────────────────────────────────────────────────────────

function preflight() {
  if (!isGitRepo()) {
    console.error(`
❌  Not a git repository.

    Run these commands first:
      git init
      git add -A
      git commit -m "initial commit"
      git remote add origin https://github.com/<user>/<repo>.git
      git push -u origin main
`);
    process.exit(1);
  }

  const remoteUrl = getRemoteUrl();
  if (!remoteUrl) {
    console.error(`
❌  No git remote "origin" found.

    Add your GitHub repository as origin:
      git remote add origin https://github.com/<user>/<repo>.git
`);
    process.exit(1);
  }

  const parsed = parseRemote(remoteUrl);
  if (!parsed) {
    console.error(`❌  Could not parse remote URL: ${remoteUrl}`);
    process.exit(1);
  }

  return { remoteUrl, ...parsed };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function deploy() {
  const { remoteUrl, user, repo } = preflight();

  // user/user.github.io → served at root; project repos → /repo-name
  const isUserSite = repo === `${user}.github.io` || repo === `${user}.github.com`;
  const basePath = isUserSite ? "" : `/${repo}`;
  const liveUrl = `https://${user}.github.io${basePath}/`;

  console.log(`
🚀  Deploying to GitHub Pages
    Remote  : ${remoteUrl}
    Repo    : ${user}/${repo}
    Base    : ${basePath || "/"}
    Live at : ${liveUrl}
`);

  // ── Step 1: Build ──────────────────────────────────────────────────────────
  console.log("▶  [1/3] Building Next.js static export…");

  const buildEnv = { ...process.env };
  if (basePath) buildEnv.NEXT_PUBLIC_BASE_PATH = basePath;

  const result = spawnSync("npm", ["run", "build"], {
    cwd: ROOT,
    env: buildEnv,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error("\n❌  Build failed. Fix the errors above and try again.");
    process.exit(1);
  }

  // ── Step 2: Prepare out/ ───────────────────────────────────────────────────
  console.log("\n▶  [2/3] Preparing output…");

  // .nojekyll prevents GitHub Pages from ignoring _next/ directory
  await fs.writeFile(path.join(ROOT, "out/.nojekyll"), "");

  const commitSha = (() => {
    try { return run("git rev-parse --short HEAD"); } catch { return "unknown"; }
  })();

  // ── Step 3: Push to gh-pages ───────────────────────────────────────────────
  console.log("\n▶  [3/3] Publishing to gh-pages branch…");

  await new Promise((resolve, reject) => {
    ghpages.publish(
      "out",
      {
        branch: "gh-pages",
        dotfiles: true, // include .nojekyll
        message: `Deploy ${commitSha} — ${new Date().toISOString().split("T")[0]}`,
        repo: remoteUrl,
      },
      (err) => (err ? reject(err) : resolve())
    );
  });

  console.log(`
✅  Deployed successfully!

    Live URL: ${liveUrl}

    It can take 1-2 minutes for GitHub Pages to update.

    ⚙   If this is the first deploy, make sure GitHub Pages is configured:
        Repository → Settings → Pages → Source: Deploy from branch → gh-pages / root
`);
}

deploy().catch((err) => {
  console.error("\n❌  Deploy failed:", err.message || err);
  process.exit(1);
});
