import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import electron from "vite-plugin-electron/simple";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: "index.ts",
        vite: {
          build: {
            outDir: "out",
            rollupOptions: {
              output: {
                entryFileNames: "index.js",
              },
            },
          },
        },
      },
      preload: {
        input: "preload/index.ts",
        vite: {
          build: {
            outDir: "out",
            rollupOptions: {
              output: {
                entryFileNames: "preload.js",
              },
            },
          },
        },
      },
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "out",
    emptyOutDir: true,
  },
});
