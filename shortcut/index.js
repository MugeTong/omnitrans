import {registerSearchShortcut, deregisterSearchShortcut} from './search-shortcut.js';

// collect all shortcuts and register them
export function registerAllShortcuts(mainWindow, omniWindow) {
  registerSearchShortcut(omniWindow);
}

// unregister all shortcuts
export function deregisterAllShortcuts() {
  deregisterSearchShortcut();
}
