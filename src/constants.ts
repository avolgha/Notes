import {access, mkdirSync as mkdir, writeFileSync, existsSync} from 'fs';
import {join} from 'path';
import fetch from 'node-fetch';

const homedir = require('os').homedir();

export const notePath = join(homedir, '.notes');
export const viewsPath = join(homedir, '.views');

export const checkForNotesDir = (create: boolean) => {
  access(notePath, (err) => {
    if (err && err.code === 'ENOENT' && create) {
      mkdir(notePath);
    }
  });
}

export const checkForViewsDir = (create: boolean) => {
  access(viewsPath, (err) => {
    if (err && err.code === 'ENOENT' && create) {
      mkdir(viewsPath);
    }
  });
}

async function getViewContentFromWeb(view: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/avolgha/Notes/dev/views/${view}.ejs`;
  const response = await fetch(url);
  const content = await response.text();
  return content;
}

export const insertViews = () => {
  checkForViewsDir(true);

  for (const view of ['edit', 'error', 'index']) {
    if (!existsSync(join(viewsPath, view + '.ejs'))) {
      getViewContentFromWeb(view).then((content) => {
        writeFileSync(join(viewsPath, view + '.ejs'), content);
      }).catch((err) => {
        console.error(err);
      });
    }
  }
}