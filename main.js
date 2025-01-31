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
process.env.ENVIRONMENT = 'development';  // set the environment
// const DARK_THEME = nativeTheme.shouldUseDarkColors;  // get the theme
const DARK_THEME = true;  // get the theme

async function createMainWindow() {
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
  if (process.env.ENVIRONMENT === 'development') mainWindow.webContents.openDevTools();
  // load the window content
  if (process.env.ENVIRONMENT === 'development') {
    await mainWindow.loadURL('http://localhost:5173/');
  } else {
    await mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

async function createOmniWindow() {
  // mini window like the DeepL for portable use
  omniWindow = new BrowserWindow({
    height: 262,
    width: 482,
    show: false,  // hide the window to wait for shortcut call
    titleBarStyle: 'hidden',  // no need for title bar
    alwaysOnTop: true,  // always on top
    transparent: true,  // transparent background
    skipTaskbar: true, // hide the taskbar icon
    resizable: false,  // not resizable
    webPreferences: {
      preload: path.resolve(__dirname, 'preload/index.js'),
    },
  });
  omniWindow.on('blur', () => {
    // minimize the window instead of hiding to keep the animation more smoothly
    omniWindow.minimize();
  });
  omniWindow.on('close', (event) => {
    event.preventDefault();
    // minimize the window instead of hiding to keep the animation more smoothly
    omniWindow.minimize();
  });
  // open the dev tools
  if (process.env.ENVIRONMENT === 'development') omniWindow.webContents.openDevTools();
  // load the omni window content
  if (process.env.ENVIRONMENT === 'development') {
    await omniWindow.loadURL('http://localhost:5173/omni.html');
  } else {
    await omniWindow.loadFile(path.join(__dirname, 'dist/omni.html'));
  }
}

async function createTray() {
  // the small icon for the system tray
  tray = new Tray(path.join(__dirname, 'public', 'logo.png'));
  tray.setToolTip('omnitrans');  // icon prompt
  tray.setContextMenu(Menu.buildFromTemplate([  // right-click menu
    {label: `复制应用信息：Omnitrans ${app.getVersion()}`, click: toggleWindow},
    {
      label: '退出', click: () => {
        // remove the above listener so that the app can quit normally
        omniWindow.removeAllListeners('close');
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
    await createMainWindow();
    await createOmniWindow();
  }
});

app.on('will-quit', () => {
  deregisterAllShortcuts();  // deregister all shortcuts
  mainWindow = null;  // release window resource
  omniWindow = null;
  tray.destroy();  // remove tray icon
});

// open the window when the app is ready
app.whenReady().then(async () => {
  await createMainWindow();  // create the main window
  await createOmniWindow();  // create the omni window
  await createTray();  // create the tray icon
  setupAllIpcHandler(mainWindow, omniWindow);  // register ipcMain handle events
  registerAllShortcuts(mainWindow, omniWindow);  // register global shortcuts
});
