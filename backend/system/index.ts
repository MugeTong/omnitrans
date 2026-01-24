import { ipcMain, clipboard, screen } from "electron";

function registerSystemIpcHandlers(mainWindow: Electron.BrowserWindow, omniWindow: Electron.BrowserWindow) {
  ipcMain.handle("system:readClipboard", async (event) => {
    return clipboard.readText();
  });

  ipcMain.handle("system:getCursorScreenPoint", async (event) => {
    return screen.getCursorScreenPoint();
  });
}

export { registerSystemIpcHandlers };
