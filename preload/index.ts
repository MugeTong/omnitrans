import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("rustBridge", {
  listenDoubleCtrlC: async (timeout: number) => {
    return await ipcRenderer.invoke("rust:listenDoubleCtrlC", timeout);
  },
});

contextBridge.exposeInMainWorld("translationBridge", {
  translate: async (textValue: string) => {
    return await ipcRenderer.invoke("translation:translate", textValue);
  },
});

contextBridge.exposeInMainWorld("systemBridge", {
  readClipboard: async () => {
    return await ipcRenderer.invoke("system:readClipboard");
  },
  getCursorScreenPoint: async () => {
    return await ipcRenderer.invoke("system:getCursorScreenPoint");
  },
});

contextBridge.exposeInMainWorld("windowBridge", {
  showOmniWindow: async () => await ipcRenderer.invoke("window:showOmniWindow"),
  closeOmniWindow: async () => await ipcRenderer.invoke("window:closeOmniWindow"),
  getOmniWindowSize: async () => await ipcRenderer.invoke("window:getOmniWindowSize"),
  resizeOmniWindow: async (width: number, height: number) =>
    await ipcRenderer.invoke("window:resizeOmniWindow", width, height),
});

// Every eventt should be used just once in each render process
contextBridge.exposeInMainWorld("eventBridge", {
  onDoubleCtrlC: (callback: (...args: any[]) => void) => {
    const subscription = (_event: IpcRendererEvent, ...args: any[]) => callback(...args);
    ipcRenderer.on("event:doubleCtrlC", subscription);
    return () => ipcRenderer.removeListener("event:doubleCtrlC", subscription);
  },
  onEventTemplate: (callback: (...args: any[]) => void) => {
    const subscription = (_event: IpcRendererEvent, ...args: any[]) => callback(...args);
    ipcRenderer.on("event:template", subscription);
    return () => ipcRenderer.removeListener("event:template", subscription);
  },
});

console.log("[preload] scripts loaded.");
