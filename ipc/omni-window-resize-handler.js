import {ipcMain} from 'electron';

export function setupOmniWindowResizeHandler(omniWindow) {
  // initialize the size of the omni window
  const initialSize = omniWindow.getSize();
  let [width, height] = omniWindow.getSize();

  ipcMain.on('omniWindow:get-size', (_) => {
    [width, height] = omniWindow.getSize();
  });

  ipcMain.on('omniWindow:resize', (e, deltaHeight, deltaWidth) => {
    omniWindow.setMinimumSize(...initialSize);
    omniWindow.setSize(width + deltaWidth, height + deltaHeight);
  });
}
