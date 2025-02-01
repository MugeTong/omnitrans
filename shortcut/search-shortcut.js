import {spawn} from 'child_process';
import {fileURLToPath} from 'node:url';
import path from 'path';

let exeProcess = null;
let clipboardUpdateTimeLast = 0;  // last clipboard update time

export function registerSearchShortcut(omniWindow) {
  // Define the listener process path
  const cwdPath = process.env.NODE_ENV === 'development'
      ? path.dirname(fileURLToPath(import.meta.url))
      : path.join(process.resourcesPath, 'scripts');

  // check the platform
  if (process.platform === 'win32') {
    // create one process for the clipboard listener as the shortcut event
    // there is no need to pipe the output
    exeProcess = spawn('clipboardListener.exe', [], {cwd: cwdPath});

    exeProcess.stdout.on('data', async (_) => {
      // check the clipboard update time
      if (Date.now() - clipboardUpdateTimeLast < 1000) {
        setTimeout(() => {
          omniWindow.show();
        }, 100);
      }
      clipboardUpdateTimeLast = Date.now();
    });
  } else if (process.platform === 'darwin') {
    throw new Error('Not implemented yet');
  } else if (process.platform === 'linux') {
    throw new Error('Not implemented yet');
  }
}

export function deregisterSearchShortcut() {
  exeProcess.kill('SIGINT');
}
