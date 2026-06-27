import { defineConfig } from "vite";

export default defineConfig({
  root: "apps/arma-el-presupuesto-de-el-salvador",
  base: "./",
  publicDir: "public",
  build: {
    outDir: "../../dist/arma-el-presupuesto-de-el-salvador",
    emptyOutDir: true
  }
});
