// import {ipcRenderer, contextBridge} from "electron";
// We still can't use the ES6, although we set the `"type": "module"` in package.json.
const {ipcRenderer, contextBridge} = require('electron');

async function settingSetApi(config) {
  // pass application setting config to change the window
  const result = await ipcRenderer.invoke('on-set-setting', config);
  console.log(result);
}

async function textTranslationApi(textValue) {
  // pass the word to Node.js to use https to search the translation
  return await ipcRenderer.invoke('on-translate-text', textValue);
}

async function OmniWindowGetSizeApi() {
  // submit the resize event to resize the omni window dynamically
  return await ipcRenderer.invoke('omniWindow:get-size');
}

async function OmniWindowResizeApi(deltaHeight, deltaWidth) {
  // submit the resize event to resize the omni window dynamically
  return await ipcRenderer.invoke('omniWindow:resize', deltaHeight, deltaWidth);
}

// expose the functions to browser
contextBridge.exposeInMainWorld('bridge', {
  settingSetApi,
  textTranslationApi,
  OmniWindowGetSizeApi,
  OmniWindowResizeApi,
});
