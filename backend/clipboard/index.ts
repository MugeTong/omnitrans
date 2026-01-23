import { ipcMain, clipboard } from "electron";

function registerClipboardIpcHandlers(mainWindow: Electron.BrowserWindow, omniWindow: Electron.BrowserWindow) {
  ipcMain.handle("clipboard:readText", async (event) => {
    return clipboard.readText();
  });
}

export { registerClipboardIpcHandlers };
