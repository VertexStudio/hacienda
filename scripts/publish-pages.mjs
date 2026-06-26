import { cp, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const gameSlug = process.argv[2];

if (!gameSlug) {
  throw new Error("Usage: node scripts/publish-pages.mjs <game-slug>");
}

const distDir = resolve(repoRoot, "dist", gameSlug);
const pagesDir = resolve(repoRoot, gameSlug);

await rm(pagesDir, { recursive: true, force: true });
await cp(distDir, pagesDir, { recursive: true });
