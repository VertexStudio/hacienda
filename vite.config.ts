import { defineConfig } from "vite";

export default defineConfig({
  root: "game",
  base: "./",
  publicDir: false,
  build: {
    outDir: "../dist",
    emptyOutDir: true
  }
});
