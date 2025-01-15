import {app, BrowserWindow, Tray, Menu} from 'electron';
import path from 'path';
import {fileURLToPath} from "node:url";

let mainWindow = null;  // window for the main app
let omniWindow = null;  // window for the omni box one mini translator
let tray = null;  // tray icon

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEVELOPMENT = true
const DARK_THEME = true

const mainEntrance = DEVELOPMENT ? "http://localhost:5173/" : path.join(__dirname, 'index.html')


const createWindow = () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 1400,
        minHeight: 270,
        minWidth: 400,
        show: false,  // hide the window
        backgroundColor: '#000',
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: 'rgba(0,0,0,0)',
            height: 35,
            symbolColor: DARK_THEME ? 'white' : 'black'
        }
    });
    // load the window content
    mainWindow.loadURL(mainEntrance).then(() => {
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
        titleBarStyle: 'hidden'
    });


    tray = new Tray(path.join(__dirname, 'src', 'assets', 'logo.png'));
    tray.setToolTip('omnitrans');
    tray.setContextMenu(Menu.buildFromTemplate([
        {label: '复制应用信息', click: toggleWindow},
        {label: '退出', click: () => app.quit()},
    ]));
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

function toggleWindow() {
    if (mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        mainWindow.show();
        mainWindow.focus();
    }
}



