import express from 'express';
import {readdirSync, readFileSync} from 'fs';
import {join} from 'path';
import markdown from 'markdown-it';

const get = () => readdirSync(join(__dirname, '..', 'notes'), {encoding: 'utf8'})
  .filter(file => file.endsWith('.md'))
  .map(file => { return {name: file.substr(0, file.length - '.md'.length)}; });

export default function startServer() {
  const server = express();

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

  server.listen(6767)
  console.log('[*] Listening on port `6767`')
}
