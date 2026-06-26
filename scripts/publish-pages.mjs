import { cp, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(repoRoot, "dist");

await rm(resolve(repoRoot, "assets"), { recursive: true, force: true });
await cp(resolve(distDir, "index.html"), resolve(repoRoot, "index.html"));
await cp(resolve(distDir, "assets"), resolve(repoRoot, "assets"), {
  recursive: true
});
