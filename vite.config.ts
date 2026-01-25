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
        entry: "main.ts",
        vite: {
          build: {
            outDir: "out",
            rollupOptions: {
              output: {
                entryFileNames: "main.js",
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
    outDir: "out/render",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        omni: fileURLToPath(new URL("./omni.html", import.meta.url)),
      },
    },
  },
});
