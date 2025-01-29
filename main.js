import {app, BrowserWindow, Tray, Menu} from 'electron';
import path from 'path';
import {fileURLToPath} from 'node:url';
import {setupAllIpcHandler} from './ipc/index.js';
import {registerAllShortcuts, deregisterAllShortcuts} from './shortcut/index.js';

let mainWindow = null;  // window for the main app
let omniWindow = null;  // window for the omni box one mini translator
let tray = null;  // tray icon

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENVIRONMENT = 'development';  // get the environment
const DARK_THEME = true;

async function createWindow() {
  mainWindow = new BrowserWindow({
    height: 500,  // main window height
    width: 800,  // main widow width
    minHeight: 270,  // limit the min height
    minWidth: 400,  // limit the min width
    show: false,  // hide the window until it is ready
    backgroundColor: 'rgba(0,0,0)',  // set app background color
    titleBarStyle: 'hidden',  // hide the app title bar
    titleBarOverlay: {  // make the default overlay appear
      color: 'rgba(0,0,0,0)',  // set overlay background transparent
      height: 35,  // same as VS Code
      symbolColor: DARK_THEME ? 'white' : 'black',  // icon color
    },
    webPreferences: {
      preload: path.resolve(__dirname, 'preload/index.js'),
    },
  });
  // show the window when ready
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });
  // prevent window destruction, because we need to keep the app running
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
  // open the dev tools
  if (ENVIRONMENT === 'development') mainWindow.webContents.openDevTools();
  // load the window content
  if (ENVIRONMENT === 'development') {
    await mainWindow.loadURL('http://localhost:5173/');
  } else {
    await mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // mini window like the DeepL for portable use
  omniWindow = new BrowserWindow({
    height: 600,
    width: 200,
    show: false,  // hide the window to wait for shortcut call
    titleBarStyle: 'hidden',  // no need for title bar
  });
  omniWindow.on('close', (event) => {
    event.preventDefault();
    omniWindow.hide();
  });
  // load the omni window content

  // the small icon for the system tray
  tray = new Tray(path.join(__dirname, 'src', 'assets', 'logo.png'));
  tray.setToolTip('omnitrans');  // icon prompt
  tray.setContextMenu(Menu.buildFromTemplate([  // right-click menu
    {label: '复制应用信息', click: toggleWindow},
    {
      label: '退出', click: () => {
        // remove the above listener so that the app can quit normally
        mainWindow.removeAllListeners('close');
        app.quit();  // quit the application
      },
    },
  ]));
  // show or hide the main window when click
  tray.on('click', toggleWindow);
}

function toggleWindow() {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
}

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});

app.on('will-quit', () => {
  mainWindow = null;  // release window resource
  omniWindow = null;
  deregisterAllShortcuts();  // deregister all shortcuts
  tray.destroy();  // remove tray icon
});

// open the window when the app is ready
app.whenReady().then(async () => {
  await createWindow();
  setupAllIpcHandler();  // register all ipcMain handle events
  registerAllShortcuts(omniWindow);  // register all global shortcuts
});
