const path = require('path');
const {app, BrowserWindow, Menu } = require('electron');

let win;

function MenuSettings() {
  Menu.setApplicationMenu(null);
}

function createWindow() {
  
  win = new BrowserWindow({
    title: 'PS Studio (Loading)',
    width: 700,
    height: 500,
    resizable: false,
  });
  win.webContents.openDevTools();

  win.loadFile('./build/index.html');

  win.on('closed', () => {
    win = null;
  });

  MenuSettings();

}

app.on('ready', createWindow);