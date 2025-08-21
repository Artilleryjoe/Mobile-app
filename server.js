const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');
const SECURE = process.env.SECURE === 'true';

function sendError(res, err) {
  if (SECURE) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  } else {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(err.stack);
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  const fsPath = path.join(ROOT, pathname);

  fs.stat(fsPath, (err, stats) => {
    if (err) return sendError(res, err);

    if (stats.isDirectory()) {
      if (SECURE) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
      } else {
        fs.readdir(fsPath, (err, files) => {
          if (err) return sendError(res, err);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<ul>' + files.map(f => `<li><a href="${path.join(pathname, f)}">${f}</a></li>`).join('') + '</ul>');
        });
      }
    } else {
      const stream = fs.createReadStream(fsPath);
      stream.on('error', err => sendError(res, err));
      stream.pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${SECURE ? 'secure' : 'demo'} mode`);
});
