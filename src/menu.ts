import {Menu, BrowserWindow, MenuItemConstructorOptions, MenuItem, Notification} from 'electron';
import {join} from 'path';
import {readFileSync} from 'fs';
import render from './render';
import {icon} from './main';
import {get} from './apiServer';

const build = (name: string, click: (window: BrowserWindow, item: MenuItem) => void, key: string, visible: boolean = true) => {
  const constructor: MenuItemConstructorOptions = {
    label: name,
    click: (event, window, webContents) => {
      if (window) click(window, event);
    },
    accelerator: key,
    enabled: visible
  };
  return constructor;
}

export default function buildMenu() {
  return Menu.buildFromTemplate([
    build(
      'Home',
      (window, item) => window.loadFile(join(__dirname, '..', 'views', 'index.html')),
      process.platform === 'darwin' ? 'Cmd+H' : 'Ctrl+H'
    ),
    {
      label: 'Dev',
      submenu: [
        build('Open Dev Tools', (window, item) => window.webContents.openDevTools(), 'F12'),
        build('Reload', (window, item) => window.reload(), 'F5')
      ]
    },
    build(
      'Edit',
      (window, item) => {
        let state = false;
        let cancel = false;
        // @ts-ignore
        window.webContents.executeJavaScript(`document.getElementById('notesHeaderImageCustomId').attributes.getNamedItem('alt').value === 'logo'`)
          .catch(error => {
            state = false;
            cancel = true;
          })
          .then(result => {
            if (cancel) return;
            if (typeof result === 'string') {
              state = result === 'true';
            } else if (typeof result === 'boolean') {
              state = result;
            }
          });

        setTimeout(() => {
          if (state) {
            new Notification({
              icon,
              title: 'Error',
              closeButtonText: 'Ok',
              body: 'You need to have a note open to edit it'
            }).show();
          } else {
            const editWindow = new BrowserWindow({
              parent: window,
              title: 'Edit note',
              autoHideMenuBar: true,
              center: true,
              show: false,
              icon,
              minWidth: 1098,
              minHeight: 613
            });

            let index = -1;
            window.webContents.executeJavaScript(`document.getElementById('index').innerHTML`)
              .catch(error => {
                render('error.ejs', { error: 'Cannot get current index of the editing file' });
                editWindow.loadFile(join(__dirname, '..', 'views', 'error.html'));
              })
              .then(result => {
                try {
                  index = parseInt(result);

                  if (index >= 0) {
                    const element = get()[index];

                    render('edit.ejs', {
                      file: element.name,
                      text: readFileSync(join(__dirname, '..', 'notes', element.name + '.md'), {encoding: 'utf8'}),
                      bounds: {
                        w: editWindow.getBounds().width,
                        h: editWindow.getBounds().height
                      }
                    });

                    editWindow.loadFile(join(__dirname, '..', 'views', 'edit.html'));
                  } else {
                    render('error.ejs', { error: 'Cannot get current index of the editing file' });
                    editWindow.loadFile(join(__dirname, '..', 'views', 'error.html'));
                  }
                } catch (e) {}
              });

            editWindow.on('ready-to-show', () => editWindow.show());
          }
        }, 1000);
      },
      process.platform === 'darwin' ? 'Cmd+E' : 'Ctrl+E'
    ),
  ]);
}
