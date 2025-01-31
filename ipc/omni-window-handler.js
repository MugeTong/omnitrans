import {ipcMain} from 'electron';

export function setupOmniWindowResizeHandler(omniWindow) {
  // initialize the size of the omni window
  const initialSize = omniWindow.getSize();
  let [width, height] = omniWindow.getSize();

  ipcMain.on('omniWindow:get-size', (_) => {
    // get the size of the omni window
    [width, height] = omniWindow.getSize();
  });

  ipcMain.on('omniWindow:resize', (e, deltaHeight, deltaWidth) => {
    // resize the omni window
    omniWindow.setMinimumSize(...initialSize);  // reset the minimum size first
    omniWindow.setSize(width + deltaWidth, height + deltaHeight);
  });

  ipcMain.on('omniWindow:close', (_) => {
    // handle the close event
    omniWindow.close();
  });
}
