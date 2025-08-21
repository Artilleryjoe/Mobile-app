const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');
const SECURE = process.env.SECURE === 'true';

// very small MIME map (good enough for the demo)
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico':  'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8'
};

function send(res, status, headers = {}, body = '') {
  res.writeHead(status, headers);
  res.end(body);
}

function notFound(res) {
  send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not found');
}

function sendError(res, err) {
  if (SECURE) {
    send(res, 500, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Internal Server Error');
  } else {
    send(res, 500, { 'Content-Type': 'text/plain; charset=utf-8' }, err.stack);
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = decodeURIComponent(parsedUrl.pathname || '/');
  // Normalize and resolve against ROOT, then bound-check to prevent traversal
  const requested = path.normalize(pathname);
  const fsPath = path.resolve(ROOT, '.' + requested);
  if (!fsPath.startsWith(ROOT)) {
    return send(res, 400, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Bad request');
  }

  // Only allow GET/HEAD for this static server
  const method = req.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    return send(res, 405, { 'Allow': 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }, 'Method Not Allowed');
  }

  fs.stat(fsPath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') return notFound(res);
      return sendError(res, err);
    }

    if (stats.isDirectory()) {
      if (SECURE) {
        // In secure mode: serve index.html if present, else 404
        const indexPath = path.join(fsPath, 'index.html');
        fs.stat(indexPath, (e, s) => {
          if (!e && s.isFile()) {
            const headers = {
              'Content-Type': MIME['.html'],
              'X-Content-Type-Options': 'nosniff',
              'Content-Security-Policy': "default-src 'self'"
            };
            res.writeHead(200, headers);
            if (method === 'HEAD') return res.end();
            fs.createReadStream(indexPath).on('error', er => sendError(res, er)).pipe(res);
          } else {
            notFound(res);
          }
        });
      } else {
        fs.readdir(fsPath, (err, files) => {
          if (err) return sendError(res, err);
          // Escape names to avoid XSS in the directory listing
          const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
          const list = files
            .map(f => `<li><a href="${encodeURI(path.posix.join(pathname, f))}">${esc(f)}</a></li>`)
            .join('');
          send(res, 200, { 'Content-Type': 'text/html; charset=utf-8' }, `<ul>${list}</ul>`);
        });
      }
    } else {
      const ext = path.extname(fsPath).toLowerCase();
      const headers = {
        'Content-Type': MIME[ext] || 'application/octet-stream'
      };
      if (SECURE) {
        headers['X-Content-Type-Options'] = 'nosniff';
        headers['Content-Security-Policy'] = "default-src 'self'";
      }
      res.writeHead(200, headers);
      if (method === 'HEAD') return res.end();
      fs.createReadStream(fsPath).on('error', er => sendError(res, er)).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${SECURE ? 'secure' : 'demo'} mode`);
});
