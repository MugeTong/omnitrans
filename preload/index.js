// import {ipcRenderer, contextBridge} from "electron";
// We still can't use the ES6, although we set the `"type": "module"` in package.json.
const {ipcRenderer, contextBridge} = require('electron');

async function settingSetApi(config) {
  // pass application setting config to change the window
  const result = await ipcRenderer.invoke('on-set-setting', config);
  console.log(result);
}

async function textTranslationApi(textValue) {
  // pass the word to Node.js to use https to search
  try {
    return await ipcRenderer.invoke('on-translate-text', textValue);
  } catch (err) {
    throw err;
  }
}

// expose the functions to browser
contextBridge.exposeInMainWorld('bridge', {
  settingSetApi,
  textTranslationApi,
});
