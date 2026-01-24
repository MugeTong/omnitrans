import { registerRustIpcHandlers } from "./rust-wrapper";
import { registerTranslationIpcHandlers } from "./translation";
import { registerSystemIpcHandlers } from "./system";
import { registerWindowIpcHandlers } from "./window";

function registerIpcHandlers(mainWindow: Electron.BrowserWindow, omniWindow: Electron.BrowserWindow) {
  registerRustIpcHandlers(mainWindow, omniWindow);
  registerTranslationIpcHandlers(mainWindow, omniWindow);
  registerSystemIpcHandlers(mainWindow, omniWindow);
  registerWindowIpcHandlers(mainWindow, omniWindow);
}

function deregisterIpcHandlers(mainWindow: Electron.BrowserWindow, omniWindow: Electron.BrowserWindow) {
  // Currently, Electron does not provide a direct way to deregister IPC handlers.
  // This function is a placeholder for future implementations if needed.
}

export { registerIpcHandlers, deregisterIpcHandlers };
