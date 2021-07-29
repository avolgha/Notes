const electron = require('electron');
const {app, BrowserWindow, nativeImage, Menu} = electron;
const {join} = require('path');

const runApplication = () => {
    const window = new BrowserWindow({
        title: 'Notes Testing'
    });

    window.loadFile(join(__dirname, 'views', 'keycodetest.html'));

    window.webContents.on('before-input-event', (e, i) => {
        console.log(i);
    });

    window.on('ready-to-show', () => window.show());
};

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() ;});

app.whenReady().then(() => {
    runApplication();
});
