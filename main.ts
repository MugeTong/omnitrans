import { app, BrowserWindow, clipboard, Menu, Tray } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerIpcHandlers, deregisterIpcHandlers } from "./backend";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    backgroundColor: "#202020",
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(32,32,32,0)",
      height: 47,
      symbolColor: "white",
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
    mainWindow.webContents.openDevTools();
  }
}

async function createOminiWindow() {
  omniWindow = new BrowserWindow({
    height: 262,
    width: 482,
    show: false,
    titleBarStyle: "hidden",
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  omniWindow.on("show", () => {
    omniWindow.webContents.send("omni:show");
  });

  omniWindow.on("blur", () => {
    omniWindow.hide();
  });

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
        label: "Reload the main window",
        click: () => {
          mainWindow.reload();
          mainWindow.show();
          console.log("[system] Main window reloaded.");
        },
      },
      {
        label: "Show Omni Window",
        click: () => {
          // force the omni window to appear, add the clipboard content as signal
          clipboard.writeText("Force the small window to appear.");
          omniWindow.show();
          omniWindow.show();
        },
      },
      {
        label: "Quit OmniTrans",
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
    deregisterIpcHandlers();
    mainWindow.destroy();
    omniWindow.destroy();
    tray.destroy();
  });
}

function main() {
  registerAppEvents();

  app.whenReady().then(async () => {
    registerIpcHandlers();
    await createMainWindow();
    await createOminiWindow();
    await createTray();
  });
}

main();
