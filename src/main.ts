import {app, BrowserWindow} from 'electron';
import {join} from 'path';
import render from './render';
import apiServer from './apiServer';

const runApplication = () => {
  const window = new BrowserWindow({
    autoHideMenuBar: true,
    center: true,
    show: false,
    title: 'Notes',
    webPreferences: {
      nodeIntegration: false
    }
  });

  window.webContents.openDevTools()

  render('index.ejs');

  window.loadFile(join(__dirname, '..', 'views', 'index.html'));

  window.on('ready-to-show', () => window.show());
};

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() ;});

app.whenReady().then(() => {
  apiServer();
  runApplication();
});
