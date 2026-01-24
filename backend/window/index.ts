import { ipcMain } from "electron";


function registerWindowIpcHandlers(mainWindow: Electron.BrowserWindow, omniWindow: Electron.BrowserWindow) {

  const initialSize= omniWindow.getSize() as [number, number];

  ipcMain.handle("window:showOmniWindow", async (event) => {
    console.log("[window IPC] Showing omni window");
    omniWindow.show();
  });

  ipcMain.handle("window:closeOmniWindow", async (event) => {
    console.log("[window IPC] Closing omni window");
    omniWindow.close();
  });

  ipcMain.handle("window:getOmniWindowSize", async (event) => {
    return omniWindow.getSize();
  });

  ipcMain.handle("window:resizeOmniWindow", async (event, width: number, height: number) => {
    omniWindow.setMinimumSize(...initialSize);
    omniWindow.setSize(width, height);
  });
}

export { registerWindowIpcHandlers };
