import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    chunkSizeWarningLimit: 1200,
  },
  server: {
    port: 4321,
    strictPort: false,
  },
});
