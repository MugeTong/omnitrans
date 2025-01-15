import {app, BrowserWindow, Tray, Menu} from 'electron';
import path from 'path';
import {fileURLToPath} from "node:url";

let mainWindow = null;  // window for the main app
let omniWindow = null;  // window for the omni box one mini translator
let tray = null;  // tray icon

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 1400,
        minHeight: 270,
        minWidth: 400,
        show: false,  // hide the window
        frame: false,  // hide the frame(Title bar)
        autoHideMenuBar: true,  // hide the menu bar
        backgroundColor: '#000',
    });
    // load the window content
    mainWindow.loadURL("http://localhost:5173/").then(() => {
        console.log("Window loaded");
    });
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
    // open the dev tools
    mainWindow.webContents.openDevTools();

    omniWindow = new BrowserWindow({
        height: 600,
        width: 200,
        show: false,  // hide the window
        frame: false,  // hide the frame(Title bar)
        autoHideMenuBar: true,  // hide the menu bar
    });


    tray = new Tray(path.join(__dirname, 'src', 'assets', 'logo.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: '复制应用信息', click: () => {}},
        { label: '显示窗口', click: () => {}},
        { label: '退出', click: () => app.quit() },
    ]);
    tray.setToolTip('Electron App');
    tray.setContextMenu(contextMenu);

}

app.whenReady().then(() => {
    createWindow()
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});