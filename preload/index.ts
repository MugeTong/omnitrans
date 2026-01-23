import { contextBridge, ipcRenderer, clipboard } from "electron";
import { read } from "fs";

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
  // onOmniShow: (callback: (...args: any[]) => void) => {
  //   const subscription = (_event: IpcRendererEvent, ...args: any[]) => callback(...args);
  //   ipcRenderer.on("omni:show", subscription);
  //   return () => ipcRenderer.removeListener("omni:show", subscription);
  // },
  onDoubleCtrlC: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on("rust:event:double-ctrl-c", subscription);
    return () => ipcRenderer.removeListener("rust:event:double-ctrl-c", subscription);
  },
});

console.log("[preload] scripts loaded.");
