import {app, BrowserWindow} from 'electron';

let mainWindow = null;  // window for the main app
let omniWindow = null;  // window for the omni box one mini translator

const createWindow = () => {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1000,
        frame: false,  // hide the frame(Title bar)
        autoHideMenuBar: true,  // hide the menu bar
    });
    // load the window content
    mainWindow.loadURL("http://localhost:5173/").then(() => {
        console.log("Window loaded");
    });
    // open the dev tools
    // window.webContents.openDevTools();

    omniWindow = new BrowserWindow({
        height: 600,
        width: 200,
        show: false,  // hide the window
        frame: false,  // hide the frame(Title bar)
        autoHideMenuBar: true,  // hide the menu bar
    });

}

app.whenReady().then(() => {
    createWindow()
});
