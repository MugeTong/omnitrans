# Electron+Vue3 Guideline

## 1. Introduction

This file helps you solve key problems in `Electron+Vue3` development, which makes setting up your own app easier.

## 2. Environments

### 2.1. Create one Vue project

use the official command to create one Vue project:

```sh
npm create vue@lastest
```

After the project is created, you can install the necessary packages:

```sh
cd <project_name>
npm install
```

After the packages installed, your root directory will have a `node_modules` folder. You can run the project by:

```sh
npm run dev
```

### 2.2. Add electron packages

- Add the electron necessary packages.

```sh
npm add electron -D
```

- Modify the `package.json`.

```json
{
  "description": "<app_description>(optional)",
  "main": "<main_electron_entrance_file>",
  "author": {
    "name": "<your_author_name>"
  },
  "license": "<license_type>",
  "scripts": {
    "start": "electron ."
  }
} 
```

- Create the main electron entrance file. (Here we create `main.js`  in the root directory.)

```js
import {app, BrowserWindow} from 'electron';

let mainWindow = null;  // window for the main app

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1000,
    });
    // load the window content
    if (ENVIRONMENT === 'development') {
        await mainWindow.loadURL("http://localhost:5173/");
    } else {
        await mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    }
}
// open the window when the app is ready
app.whenReady().then(async () => {
    await createWindow();
});
```

### 2.3. Add real-time tools

We use `modemon` to reload the electron files automatically and restart the service.

```sh
npm add nodemon -D
```

After installation, modify the start command as:

```json
{
  "scripts": {
    "start": "nodemon --exec electron . --watch . --ext .html,.js,.css,.vue"
  }
} 
```

### 2.4. How to debug?

Create two new terminals, where the first to run `npm run dev` to start Vue service and the second to run
`npm start` to start electron service.

```sh
npm run dev  # run in one terminal
```

```sh
npm start  # run in another terminal
```

We will introduce the build process in the following to help you publish your independent application.

## 3. Publish

We use electron-builder to pack the application.

### 3.1. Installation of `electron-builder`

Run the following command to install the package CLI to development environment.

```sh
npm install electron-builder -D
```

### 3.1. Packing preparation

There are some basic tasks to finish so that the CLI can pack smoothly.

#### 3.1.1. Modify `package.json`

Add the `pack` script to you `scripts` dictionary. Pack the application to the directory.

```json
{
  "scripts": {
    "pack": "electron-builder --dir"
  }
}
```

Add pack build configure in the `package.json`.

```json
{
  "build": {
    "appId": "<your_app_id>(usually the reverse domain name)",
    "productName": "<your_app_name>",
    "directories": {
      "output": "<output_directory>"
    },
    "win": {
      "target": ["nsis"],
      "icon": "<icon_path>(You can use icfox to generate the icon)"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": true,
      "allowElevation": true,
      "allowToChangeInstallationDirectory": true,
      "installerIcon": "<installer_icon_path>",
      "uninstallerIcon": "<uninstaller_icon_path>",
      "installerHeaderIcon": "<installer_header_icon_path>",
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "<shortcut_name>"
    }
  }
}
```

#### 3.1.2. Configure the `vite.config.js`

```js
export default defineConfig({
    base: './',  // set the base path so that the app can be run in the browser
})
```

#### 3.2. Pack command

```sh
npm run build  # pack youe Vue project first to `dist` folder
npm run pack  # pack the Electron app
```

> [!TIP]
>
> If you encounter the following problems:
>
> ```sh
> Get "https://some_package.zip": dial tcp x.x.x.x:443: connectex: A connection attempt failed because the connected party did not properly respond after a period of tine, or established connection failed because connected host has failed to respond.
> ```
>
> You could download the zip package and unzip it with folder in the cache file.
> ```
> ~/AppData/Local/electron/Cache/ or ~/AppData/Local/electron-builder/Cache/
> for "electron" package, electron cache; for other package, elecron-builder cache
> ```
