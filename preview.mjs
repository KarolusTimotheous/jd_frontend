import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, resolve, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { handleApi } from './server-bundle.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), 'dist');
const portIndex = process.argv.indexOf('--port');
const port = portIndex === -1 ? 4173 : Number(process.argv[portIndex + 1]);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid local preview port');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = http.createServer(async (req, res) => {
  if (await handleApi(req, res)) return;
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error('Not a file');
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Content-Length': info.size, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') res.end();
    else createReadStream(file).on('error', () => res.destroy()).pipe(res);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.on('error', (error) => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Close the other preview or use --port 4174.` : error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}/`;
  console.log(`Jeongdok preview: ${url}\nPress Ctrl+C or close this window to stop.`);
  if (process.argv.includes('--open') && process.platform === 'win32') spawn('cmd.exe', ['/c', 'start', '', url], { windowsHide: true, stdio: 'ignore' });
});
