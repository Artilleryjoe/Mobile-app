 const http = require('http');
 const fs = require('fs');
 const path = require('path');
 const url = require('url');

 const PORT = process.env.PORT || 3000;
 const ROOT = path.join(__dirname, 'public');
 const SECURE = process.env.SECURE === 'true';

+// very small MIME map (good enough for the demo)
+const MIME = {
+  '.html': 'text/html; charset=utf-8',
+  '.css':  'text/css; charset=utf-8',
+  '.js':   'text/javascript; charset=utf-8',
+  '.svg':  'image/svg+xml',
+  '.png':  'image/png',
+  '.jpg':  'image/jpeg',
+  '.jpeg': 'image/jpeg',
+  '.ico':  'image/x-icon',
+  '.json': 'application/json; charset=utf-8',
+  '.txt':  'text/plain; charset=utf-8'
+};
+
+function send(res, status, headers = {}, body = '') {
+  res.writeHead(status, headers);
+  res.end(body);
+}
+
+function notFound(res) {
+  send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not found');
+} // MDN: 404 indicates the resource is missing. :contentReference[oaicite:3]{index=3}
+
 function sendError(res, err) {
   if (SECURE) {
-    res.writeHead(500, { 'Content-Type': 'text/plain' });
-    res.end('Internal Server Error');
+    send(res, 500, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Internal Server Error');
   } else {
-    res.writeHead(500, { 'Content-Type': 'text/plain' });
-    res.end(err.stack);
+    send(res, 500, { 'Content-Type': 'text/plain; charset=utf-8' }, err.stack);
   }
 }
 
 const server = http.createServer((req, res) => {
   const parsedUrl = url.parse(req.url);
-  const pathname = decodeURIComponent(parsedUrl.pathname);
-  const fsPath = path.join(ROOT, pathname);
+  const pathname = decodeURIComponent(parsedUrl.pathname || '/');
+  // Normalize and resolve against ROOT, then bound-check to prevent traversal
+  // OWASP recommends constraining to a known base directory. :contentReference[oaicite:4]{index=4}
+  const requested = path.normalize(pathname);
+  const fsPath = path.resolve(ROOT, '.' + requested);
+  if (!fsPath.startsWith(ROOT)) {
+    return send(res, 400, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Bad request'); // deceptive routing → 400 :contentReference[oaicite:5]{index=5}
+  }
+
+  // Only allow GET/HEAD for this static server
+  const method = req.method || 'GET';
+  if (method !== 'GET' && method !== 'HEAD') {
+    return send(res, 405, { 'Allow': 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }, 'Method Not Allowed');
+  }
 
   fs.stat(fsPath, (err, stats) => {
-    if (err) return sendError(res, err);
+    if (err) {
+      // Use error.code to distinguish ENOENT from real server errors. :contentReference[oaicite:6]{index=6}
+      if (err.code === 'ENOENT') return notFound(res);
+      return sendError(res, err);
+    }
 
     if (stats.isDirectory()) {
       if (SECURE) {
-        res.writeHead(403, { 'Content-Type': 'text/plain' });
-        res.end('Forbidden');
+        // In secure mode: serve index.html if present, else 404 (not 403)
+        const indexPath = path.join(fsPath, 'index.html');
+        fs.stat(indexPath, (e, s) => {
+          if (!e && s.isFile()) {
+            const headers = {
+              'Content-Type': MIME['.html'],
+              'X-Content-Type-Options': 'nosniff', // hardening :contentReference[oaicite:7]{index=7}
+              'Content-Security-Policy': "default-src 'self'" // starter CSP :contentReference[oaicite:8]{index=8}
+            };
+            res.writeHead(200, headers);
+            if (method === 'HEAD') return res.end();
+            fs.createReadStream(indexPath).on('error', er => sendError(res, er)).pipe(res);
+          } else {
+            notFound(res);
+          }
+        });
       } else {
         fs.readdir(fsPath, (err, files) => {
           if (err) return sendError(res, err);
-          res.writeHead(200, { 'Content-Type': 'text/html' });
-          res.end('<ul>' + files.map(f => `<li><a href="${path.join(pathname, f)}">${f}</a></li>`).join('') + '</ul>');
+          // Escape names to avoid XSS in the directory listing
+          const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
+          const list = files
+            .map(f => `<li><a href="${encodeURI(path.posix.join(pathname, f))}">${esc(f)}</a></li>`)
+            .join('');
+          send(res, 200, { 'Content-Type': 'text/html; charset=utf-8' }, `<ul>${list}</ul>`);
         });
       }
     } else {
-      const stream = fs.createReadStream(fsPath);
-      stream.on('error', err => sendError(res, err));
-      stream.pipe(res);
+      const ext = path.extname(fsPath).toLowerCase();
+      const headers = {
+        'Content-Type': MIME[ext] || 'application/octet-stream'
+      };
+      if (SECURE) {
+        headers['X-Content-Type-Options'] = 'nosniff'; // prevent MIME sniffing :contentReference[oaicite:9]{index=9}
+        headers['Content-Security-Policy'] = "default-src 'self'"; // basic CSP :contentReference[oaicite:10]{index=10}
+      }
+      res.writeHead(200, headers);
+      if (method === 'HEAD') return res.end();
+      fs.createReadStream(fsPath).on('error', er => sendError(res, er)).pipe(res);
     }
   });
 });
 
 server.listen(PORT, () => {
   console.log(`Server running on port ${PORT} in ${SECURE ? 'secure' : 'demo'} mode`);
 });
