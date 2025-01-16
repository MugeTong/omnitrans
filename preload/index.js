// import {ipcRenderer, contextBridge} from "electron";
// We still can't use the ES6, although we set the `"type": "module"` in package.json.
const {ipcRenderer, contextBridge} = require("electron");

async function setSetting(config) {
    const result = await ipcRenderer.invoke('on-set-setting', config);
    console.log(result);
}

// expose the functions to browser
contextBridge.exposeInMainWorld('bridge', {
    setSetting
});
