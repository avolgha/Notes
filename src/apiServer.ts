import express from 'express';
import bodyParser from 'body-parser';
import {readdirSync, readFileSync, existsSync, writeFileSync} from 'fs';
import {join} from 'path';
import markdown from 'markdown-it';

export const get = () => readdirSync(join(__dirname, '..', 'notes'), {encoding: 'utf8'})
  .filter(file => file.endsWith('.md'))
  .map(file => { return {name: file.substr(0, file.length - '.md'.length)}; });

export function getPostData(req: express.Request, res: express.Response, callback: (data: any) => void) {
  if (req.readable) {
    let content = '';

    req.on('data', data => {
      if (content.length > 1e6) {
        res.status(413).json({ error: 'Request entity too large.' });
      }

      content += data;
    });

    req.on('end', () => {
      callback(content);
    })
  } else {
    callback(req.body);
  }
}

export function startServer() {
  const server = express();

  server.use(bodyParser());

  server.get('/get', (_req, res) => {
    console.log('[!] Request on /get');
    res.send({
      notes: get()
    });
    console.log('[?] Finished /get');
  });

  server.get('/load/:index', (req, res) => {
    console.log('[!] Request on /load');

    // @ts-ignore
    const file = get()[req.params.index].name
    const content = readFileSync(join(__dirname, '..', 'notes', file + '.md'), {encoding: 'utf8'});

    res.send(markdown().render(content));

    console.log('[?] Finished /load');
  });

  server.post('/save/:file', (req, res) => {
    const file = req.params.file;
    getPostData(req, res, content => {
      const path = join(__dirname, '..', 'notes', file + '.md');

      if (existsSync(path)) {
        writeFileSync(path, content.text, {encoding: 'utf8'});
        res.status(200).send('success');
      } else {
        res.status(501).json({ error: 'File does not exists' });
      }
    });
  });

  server.listen(6767)
  console.log('[*] Listening on port `6767`')
}
