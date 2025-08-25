# Iron Dillo Mobile App

Prototype assets for Iron Dillo Cybersecurity training.

- `terminal/commands.yaml` defines command metadata with categories and lab scopes.
- `terminal/dispatcher.js` checks metadata before execution and offers guidance when a command is out of scope.
- `ui/index.html` presents category filters to highlight the learner's current mode using brand styling.
- `react-native/` contains a minimal Expo-based React Native app prototype with Iron Dillo branding.
# Demo Server Security Modes

This repository demonstrates directory indexing and detailed error pages in a demo environment and provides a secure mode that disables listings and masks errors.

## Usage

Run in demo mode (default):

```
node server.js
```

Directory contents are listed and stack traces are returned on errors.

Run in secure mode:

```
SECURE=true node server.js
```

Directory listing is disabled and users see a generic error message.

## Security Notes

- **Directory Listing**: Attackers can enumerate files to find backups, configuration files, or other sensitive data, which aids targeted exploitation.
- **Detailed Error Messages**: Verbose stack traces disclose implementation details useful for SQL injection, path traversal, or framework-specific attacks.

Switching to secure mode mitigates these information disclosure vectors.

# Mobile-app

This repository includes a session security demonstration for the Iron Dillo Cybersecurity site.
Open `session-demo.html` in a browser to explore predictable versus secure session handling with explanatory security headers.

# Iron Dillo Mobile App

This repository hosts demo pages for illustrating common security pitfalls and their fixes.

- `insecure/login.html` and `secure/login.html` show an unsecured login with hardcoded credentials and a patched version using HTTPS, random credentials, and secure cookies.
- `insecure/form.html` and `secure/form.html` demonstrate form handling over HTTP versus HTTPS with proper cookie protection.
- `SECURITY_DEMO.md` provides side-by-side code snippets explaining each fix.

Veteran-owned cybersecurity for East Texas small businesses, individuals, and rural operations — proudly serving Lindale and Tyler.
## 60-second Smoke Test

### Demo mode
- `/` shows a directory listing.
- `/index.html` returns 200.
- `/does-not-exist` returns 404.

### Secure mode
- `/` returns 200 if `index.html` exists, otherwise 404.
- Errors are generic; stack traces are hidden.
- Responses include `X-Content-Type-Options: nosniff` and a basic `Content-Security-Policy`.
