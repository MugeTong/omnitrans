import {ipcMain} from 'electron';

export function setupOmniWindowResizeHandler(omniWindow) {
  // initialize the size of the omni window
  const initialSize = omniWindow.getSize();
  let [width, height] = omniWindow.getSize();

  ipcMain.handle('omniWindow:get-size', (_) => {
    [width, height] = omniWindow.getSize();
    return [width, height];
  });

  ipcMain.handle('omniWindow:resize', (e, deltaHeight, deltaWidth) => {
    omniWindow.setMinimumSize(...initialSize);
    omniWindow.setSize(width + deltaWidth, height + deltaHeight, true);
    return omniWindow.getSize();
  });
}
