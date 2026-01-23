import rust from "./_rust.import";
import { ipcMain } from "electron";

function registerRustIpcHandlers(mainWindow: Electron.BrowserWindow, omniWindow: Electron.BrowserWindow) {
  ipcMain.handle("rust:listenDoubleCtrlC", async (event, timeout: number) => {
    return rust.listenDoubleCtrlC(timeout, (err: Error | null) => {
        if (err) {
            console.error("[Rust IPC] Error in double ctrl+c listener:", err);
            return;
        }
        console.log("[Rust IPC] Double Ctrl+C detected by Rust");
        // Once detected, show the omni window and notify the renderer process
        setTimeout(() => {
          omniWindow.showInactive();
          // Force focus to ensure the blur event can be triggered later
          omniWindow.focus();
        }, 100);
        omniWindow.webContents.send("rust:event:double-ctrl-c");
    });
  });
}

export { registerRustIpcHandlers };
