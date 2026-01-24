import { app, BrowserWindow, clipboard, Menu, Tray, nativeTheme } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerIpcHandlers, deregisterIpcHandlers } from "./backend";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const darkMode = nativeTheme.shouldUseDarkColors;

let mainWindow: BrowserWindow;
let omniWindow: BrowserWindow;
let tray: Tray;

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 600,
    minWidth: 960,
    show: false,
    backgroundColor: darkMode ? "#202020" : "#f3f3f3",
    titleBarStyle: "hidden",
    titleBarOverlay: {
      height: 46,
      color: darkMode ? "#202020" : "#f3f3f3",
      symbolColor: darkMode ? "#f3f3f3" : "#202020",
    },
    webPreferences: {
      // Because the main process and preload will be compiled before rendering,
      // and they are both in the `out/electron` directory,
      // this `__dirname` points to the `out/electron` directory.
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  } else {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL!);
    // mainWindow.webContents.openDevTools();
  }
}

async function createOminiWindow() {
  omniWindow = new BrowserWindow({
    height: 240,
    width: 420,
    show: false,
    titleBarStyle: "hidden",
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // omniWindow.on("ready-to-show", () => {
  //   omniWindow.show();
  // });

  omniWindow.on("blur", () => {
    omniWindow.minimize();
  });

  // Minimize the window on close instead of closing it.
  // Hide and show may cause window shaking issues.
  omniWindow.on("close", (event) => {
    event.preventDefault();
    omniWindow.minimize();
  });

  if (app.isPackaged) {
    omniWindow.loadFile(path.join(__dirname, "omni.html"));
  } else {
    omniWindow.loadURL(process.env.VITE_DEV_SERVER_URL! + "omni.html");
    omniWindow.webContents.openDevTools();
  }
}

async function createTray() {
  const trayIconPath = app.isPackaged ? path.join(__dirname, "logo.png") : path.join(__dirname, "../public/logo.png");
  tray = new Tray(trayIconPath);
  tray.setToolTip("OmniTrans");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: `复制应用信息：Omnitrans ${app.getVersion()}`,
        click: () => {
          clipboard.writeText(`OmniTrans ${app.getVersion()}`);
          console.log("[system] Application info copied to clipboard.");
        },
      },
      {
        label: "重新加载主界面",
        click: () => {
          mainWindow.reload();
          mainWindow.show();
          console.log("[system] Main window reloaded.");
        },
      },
      {
        label: "显示小窗口",
        click: () => {
          console.log("[system] Force the omni window to appear.");
          omniWindow.show();
        },
      },
      {
        label: "退出",
        click: () => {
          console.log("[system] Quitting application.");
          mainWindow.removeAllListeners("close");
          omniWindow.removeAllListeners("close");
          app.quit();
        },
      },
    ]),
  );

  tray.on('click', () => {
    mainWindow.show();
  });
}

function registerAppEvents() {
  // Ensure a single instance of the application
  if (!app.requestSingleInstanceLock()) app.quit();

  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createMainWindow();
  });

  app.on("will-quit", () => {
    deregisterIpcHandlers(mainWindow, omniWindow);
    mainWindow.destroy();
    omniWindow.destroy();
    tray.destroy();
  });

  // Handle system theme changes
  nativeTheme.on("updated", () => {
    if (!mainWindow.isDestroyed()) {
      const shouldDarkMode = nativeTheme.shouldUseDarkColors;
      mainWindow.setTitleBarOverlay({
        color: shouldDarkMode ? "#202020" : "#f3f3f3",
        symbolColor: shouldDarkMode ? "#ffffff" : "#000000",
      });
      // Update main window background color to avoid visual glitches
      mainWindow.setBackgroundColor(shouldDarkMode ? "#202020" : "#f3f3f3");
    }
  });
}

function main() {
  registerAppEvents();

  app.whenReady().then(async () => {
    await createMainWindow();
    await createOminiWindow();
    registerIpcHandlers(mainWindow, omniWindow);
    await createTray();
  });
}

main();
