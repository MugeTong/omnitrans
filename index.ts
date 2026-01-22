import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerIpcHandlers, deregisterIpcHandlers } from "./backend";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow;
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
          console.log("[system] Main window reloaded.");
        },
      },
      {
        label: "Quit OmniTrans",
        click: () => {
          mainWindow.removeAllListeners("close");
          console.log("[system] Quitting application.");
          app.quit();
        },
      },
    ]),
  );
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
    tray.destroy();
  });

}


function main() {
  registerAppEvents();

  app.whenReady().then(async () => {
    registerIpcHandlers();
    await createMainWindow();
    await createTray();
  });
}

main();
