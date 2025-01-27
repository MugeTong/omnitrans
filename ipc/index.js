import {setupTextTranslationHandler} from './word-translation-handler.js';

// collect all the ipc handlers and set them up
export function setupAllIpcHandler() {
  setupTextTranslationHandler();
}
