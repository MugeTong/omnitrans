import {app, BrowserWindow, Tray, Menu, nativeTheme, clipboard} from 'electron';
import path from 'path';
import {fileURLToPath} from 'node:url';
import {setupAllIpcHandler} from './ipc/index.js';
import {registerAllShortcuts, deregisterAllShortcuts} from './shortcut/index.js';

// prevent the app from running multiple instances
if (!app.requestSingleInstanceLock()) app.quit();

let mainWindow = null;  // window for the main app
let omniWindow = null;  // window for the omni box one mini translator
let tray = null;  // tray icon

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DARK_THEME = nativeTheme.shouldUseDarkColors;  // get the theme

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
      symbolColor: 'white',  // icon color
    },
    webPreferences: {
      preload: path.resolve(__dirname, 'preload/index.js'),
    },
  });
  // show the window when ready
  mainWindow.on('ready-to-show', () => {
    // set the theme to the renderer process
    mainWindow.webContents.send('theme', DARK_THEME ? 'dark' : 'light');
    mainWindow.show();
    // listen to the theme change event
    nativeTheme.on('updated', () => {
      mainWindow.webContents.send('theme', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    });
  });
  // prevent window destruction, because we need to keep the app running
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
  // open the dev tools
  if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools();
  // load the window content
  if (process.env.NODE_ENV === 'development') {
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
  omniWindow.on('ready-to-show', () => {
    // send the theme to the renderer process
    omniWindow.webContents.send('theme', DARK_THEME ? 'dark' : 'light');
    nativeTheme.on('updated', () => {
      omniWindow.webContents.send('theme', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    });
  });
  // show the window when ready
  omniWindow.on('show', () => {
    // send translate event to the renderer process
    setTimeout(() => {
      omniWindow.webContents.send('omniWindow:show-to-search');
    }, 100);
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
  if (process.env.NODE_ENV === 'development') omniWindow.webContents.openDevTools();
  // load the omni window content
  if (process.env.NODE_ENV === 'development') {
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
      label: '显示小窗口', click: () => {
        // force the omni window to appear, add the clipboard content as signal
        clipboard.writeText('force the small window to appear');
        omniWindow.show();
      },
    },
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

// prevent the new instance and show the first instance main window
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

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
