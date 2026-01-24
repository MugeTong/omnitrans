import { ipcMain } from "electron";

function registerWindowIpcHandlers(mainWindow: Electron.BrowserWindow, omniWindow: Electron.BrowserWindow) {
  ipcMain.handle("window:showOmniWindow", async (event) => {
    console.log("[window IPC] Showing omni window");
    omniWindow.show();
  });

  ipcMain.handle("window:closeOmniWindow", async (event) => {
    console.log("[window IPC] Closing omni window");
    omniWindow.close();
  });

  ipcMain.handle("window:getOmniWindowBounds", async (event) => {
    return omniWindow.getBounds();
  });
}

export { registerWindowIpcHandlers };
