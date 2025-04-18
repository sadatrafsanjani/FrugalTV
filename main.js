const { BrowserWindow, app, ipcMain } = require('electron/main')
const path = require('node:path')
const fs = require('fs');
const { session } = require('electron');
require('electron-reloader')(module);

/* =================== VARIABLES =================== */
let mainWindow;
const channelWindows = new Map();

/* =================== WINDOW =================== */
const createWindow = () => {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, './asset/js/preload.js')
        },
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    })

    //mainWindow.webContents.openDevTools();
    mainWindow.loadFile('index.html');
    mainWindow.removeMenu();

    mainWindow.on('closed', () => {
        for (const [, win] of channelWindows) {
            if (!win.isDestroyed()) {
                win.close();
            }
        }
        channelWindows.clear();
    });
}

app.whenReady().then(() => {

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {

        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
        details.requestHeaders['Referer'] = 'https://www.google.com/';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.handle('getCategories', async (event, folderPath) => {

    try {
        return fs.readdirSync(folderPath);
    }
    catch (err) {
        console.error('Error loading categories:', err);
    }

    return [];
});

ipcMain.handle('getCountries', async (event, folderPath) => {

    try {
        return fs.readdirSync(folderPath);
    }
    catch (err) {
        console.error('Error loading countries:', err);
    }

    return [];
});

ipcMain.on('channel-data', (event, channelName, folder) => {

    console.log('Folder', folder);

    if (channelWindows.has(channelName)) {

        const existingWin = channelWindows.get(channelName);

        if (existingWin && !existingWin.isDestroyed()) {
            existingWin.focus();
            return;
        }
    }

    const channelWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: channelName,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, './asset/js/preload.js')
        },
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')

    });

    channelWindow.loadFile('channels.html').then(() => {
        channelWindow.webContents.send('channelName', channelName);
    });

    channelWindow.webContents.openDevTools();
    channelWindow.removeMenu();
    channelWindows.set(channelName, channelWindow);

    channelWindow.on('closed', () => {
        channelWindows.delete(channelName);
    });
});
