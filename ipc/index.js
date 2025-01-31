import {setupTextTranslationHandler} from './word-translation-handler.js';
import {setupOmniWindowResizeHandler} from './omni-window-handler.js';

// collect all the ipc handlers and set them up
export function setupAllIpcHandler(mainWindow, omniWindow) {
  setupTextTranslationHandler();
  setupOmniWindowResizeHandler(omniWindow);
}
