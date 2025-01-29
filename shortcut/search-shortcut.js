import {spawn} from 'child_process';
import {fileURLToPath} from 'node:url';
import path from 'path';

let exeProcess = null;

export function registerSearchShortcut(omniWindow) {
  // check the platform
  if (process.platform === 'win32') {
    // create one process for the clipboard listener as the shortcut event
    spawn('clipboardListener.exe', [], {
      // set the current working directory,
      // and there is no need to pipe the output
      cwd: path.dirname(fileURLToPath(import.meta.url)),
    }).stdout.on('data', (_) => {
      // show the omni window
      omniWindow.show();
      // focus on the omni window
      omniWindow.focus();
    });
  }
  if (process.platform === 'darwin') {
    throw new Error('Not implemented yet');
  }
  if (process.platform === 'linux') {
    throw new Error('Not implemented yet');
  }
}

export function deregisterSearchShortcut() {
  exeProcess.kill('SIGINT');
}