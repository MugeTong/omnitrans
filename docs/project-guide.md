# Set up one electron app with Vue3 and Rust

## Add Vue3 and Electron
## 1. Create one Vue3 project

```bash
npm create vue@latest
```

After that, install the packages with `npm install`.

## 2. Add Electron to the Vue3 project
```bash
npm install electron @types/electron --save-dev # Add electron dependency
npm install vite-plugin-electron --save-dev  # Let vite support the electron for hot-reloading
```

## 3. Update the `vite.config.ts`
```ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import electron from 'vite-plugin-electron/simple'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: "index.ts",
        vite: {
          build: {
            outDir: "out/electron",
            rollupOptions: {
              output: {
                entryFileNames: "index.js"
              },
            },
          },
        },
      },
      preload: {
        input: "preload/index.ts",
        vite: {
          build: {
            outDir: "out/electron",
            rollupOptions: {
              output: {
                entryFileNames: "preload.js"
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
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: "out/render",
    emptyOutDir: true,
  }
})
```
## 4. Modify the `tsconfig.json` to support TypeScript compilation
> For me, I remove the `env.d.ts`, `tsconfig.app.json` and `tsconfig.node.json` for less files in the root dir.
> vite-electron-plugin will handle the scripts for electron, so there is no need to add those files into the configuration.

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Node",
    "lib": [
      "ESNext",
      "DOM"
    ],
    "allowJs": false,
    "jsx": "preserve",
    "sourceMap": true,
    "strict": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": [
      "vite/client"
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
  ],
}
```
## 5. Modify `package.json` to add the project package entrance
```json
{
    "main": "out/electron/index.js",
}
```

## Create files for electron
```ts
\\ index.ts
import { app, BrowserWindow } from "electron";

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });

  win.loadFile("http://localhost:5173/");
}

app.whenReady().then(async () => {
  await createWindow();
});
```
```typescript
\\preload/index.ts
console.log("[preload] scripts loads.");
```

## Add Rust dependencies
