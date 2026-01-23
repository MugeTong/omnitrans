import { contextBridge, ipcRenderer, IpcRendererEvent} from "electron";

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

contextBridge.exposeInMainWorld("clipboardBridge", {
  readClipboard: async () => {
    return await ipcRenderer.invoke("clipboard:readText");
  },
});


// Every eventt should be used just once in each render process
contextBridge.exposeInMainWorld("eventBridge", {
  onDoubleCtrlC: (callback: (...args: any[]) => void) => {
    const subscription = (_event: IpcRendererEvent, ...args: any[]) => callback(...args);
    ipcRenderer.on("event:double-ctrl-c", subscription);
    return () => ipcRenderer.removeListener("event:double-ctrl-c", subscription);
  },
  onEventTemplate: (callback: (...args: any[]) => void) => {
    const subscription = (_event: IpcRendererEvent, ...args: any[]) => callback(...args);
    ipcRenderer.on("event:template", subscription);
    return () => ipcRenderer.removeListener("event:template", subscription);
  }
});

console.log("[preload] scripts loaded.");
