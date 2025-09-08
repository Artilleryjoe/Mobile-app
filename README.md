# Iron Dillo Mobile App

Prototype assets for Iron Dillo Cybersecurity training. Veteran-owned cybersecurity for East Texas small businesses, individuals, and rural operations proudly serving Lindale and Tyler.

## Getting Started

Install dependencies and run the test suite:

```bash
npm install
npm test
```

Launch the Node demo server:

```bash
node server.js
```

To explore the React Native prototype, start the Expo dev server:

```bash
cd react-native
npm install
npm start
```

## Features
- **Terminal labs**: `terminal/commands.yaml` defines command metadata with categories and lab scopes, and `terminal/dispatcher.js` enforces those rules and offers guidance when a command is out of scope.
- **Web UI**: `ui/index.html` uses Tailwind CSS, the Inter font, and Iron Dillo colors to let learners filter categories and highlight the active mode.
- **React Native prototype**: `react-native/` contains a minimal Expo-based app with consistent branding.

## Demo server
The Node server showcases secure vs. demo modes.

```bash
# demo mode (directory listings and detailed errors)
node server.js

# secure mode (no listings, generic errors)
SECURE=true node server.js
```

## Security notes
- **Directory listing**: Attackers can enumerate files to find backups, configs, or other sensitive data.
- **Detailed error messages**: Verbose stack traces disclose implementation details useful for SQL injection, path traversal, or framework-specific attacks.

Switching to secure mode mitigates these information disclosure vectors.

## Session security demo
`session-demo.html` contrasts predictable session IDs with secure, random identifiers and demonstrates security headers.

## Additional demo pages
- `insecure/login.html` and `secure/login.html` compare an unsecured login with a patched version using HTTPS, random credentials, and secure cookies.
- `insecure/form.html` and `secure/form.html` show form handling over HTTP versus HTTPS with proper cookie protection.
- See `SECURITY_DEMO.md` for side-by-side code snippets explaining each fix.

## 60-second smoke test

### Demo mode
- `/` shows a directory listing.
- `/index.html` returns 200.
- `/does-not-exist` returns 404.

### Secure mode
- `/` returns 200 if `index.html` exists, otherwise 404.
- Errors are generic; stack traces are hidden.
- Responses include `X-Content-Type-Options: nosniff` and a basic `Content-Security-Policy`.
