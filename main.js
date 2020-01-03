const {app, BrowserWindow} = require('electron');
const path = require('path');
let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024 / 2,
    height: 576 / 2,
    backgroundColor: '#000000',
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => (mainWindow = null));
};

app.on('ready', createWindow);

app.on('window-all-closed', () =>
  process.platform !== 'darwin' ? app.quit() : null,
);

app.on('activate', () => (mainWindow === null ? createWindow() : null));
