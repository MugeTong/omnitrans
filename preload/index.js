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

function OmniWindowGetSizeApi() {
  // submit the resize event to resize the omni window dynamically
  ipcRenderer.send('omniWindow:get-size');
}

function OmniWindowResizeApi(deltaHeight, deltaWidth) {
  // submit the resize event to resize the omni window dynamically
  ipcRenderer.send('omniWindow:resize', deltaHeight, deltaWidth);
}

function OmniWindowCloseApi() {
  // submit the close event to close the omni window
  ipcRenderer.send('omniWindow:close');
}

function OnOmniWindowShow(callback) {
  // submit the search event to search the text in the omni window
  ipcRenderer.on('omniWindow:show-to-search', async () => {
    await callback();
  });
}

function OnThemeChange(callback) {
  // submit the theme event to change the theme of the omni and main window
  ipcRenderer.on('theme', (event, theme) => {
    callback(theme);
  });
}

// expose the functions to browser
contextBridge.exposeInMainWorld('bridge', {
  settingSetApi,
  textTranslationApi,
  OmniWindowGetSizeApi,
  OmniWindowResizeApi,
  OmniWindowCloseApi,
  OnOmniWindowShow,
  OnThemeChange,
});
