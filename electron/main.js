const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { createServer } = require('http');
const fs = require('fs');

let mainWindow;
const PORT = 7172;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 390,
    minHeight: 700,
    title: 'FloraIQ',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    backgroundColor: '#0a0a0a',
    show: false,
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());

  // Open external links in browser, not in Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Serve built files via local HTTP server
    const serveStatic = require('./serve-static');
    serveStatic(PORT, path.join(__dirname, '../dist/public'), () => {
      mainWindow.loadURL(`http://localhost:${PORT}`);
    });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
