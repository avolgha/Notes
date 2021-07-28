import {app, BrowserWindow, nativeImage, Menu} from 'electron';
import {join} from 'path';
import render from './render';
import {startServer} from './apiServer';
import menu from './menu';

const icon = nativeImage.createFromPath(join(__dirname, '..', 'icon.png'));
icon.setTemplateImage(true);

export {icon};

const runApplication = () => {
  const window = new BrowserWindow({
    autoHideMenuBar: false,
    center: true,
    show: false,
    title: 'Notes',
    webPreferences: {
      nodeIntegration: false
    },
    icon,
    minWidth: 1098,
    minHeight: 613
  });

  render('index.ejs', undefined); window.loadFile(join(__dirname, '..', 'views', 'index.html'));

  Menu.setApplicationMenu(menu());

  window.on('ready-to-show', () => window.show());
};

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() ;});

app.whenReady().then(() => {
  startServer();
  runApplication();
});
