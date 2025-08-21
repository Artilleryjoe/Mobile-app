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
