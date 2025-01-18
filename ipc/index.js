import {setupWordSearchHandler} from "./word-search-handler.js";

// collect all the ipc handlers and set them up
export function setupAllIpcHandler() {
    setupWordSearchHandler();
}
