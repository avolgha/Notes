import {join} from 'path';
import {readFileSync, writeFileSync} from 'fs';
import {render} from 'ejs';
import {viewsPath} from './constants';

/**
 * Reads the content of the given file and compiles it content with ejs and then write to a .html file
 *
 * @param path The path of the file you want to compile to static HTML
 */
export default function renderFunction(path: string, param: any | undefined): void {
  if (!path.endsWith('.ejs')) {
    throw new Error('can only compile .ejs files');
  }

  const html = render(
    readFileSync(join(viewsPath, path), {encoding: 'utf8'}),
    param
  );

  writeFileSync(join(viewsPath, path.substr(0, path.length - '.ejs'.length) + '.html'), html, {
    encoding: 'utf8'
  });
}
