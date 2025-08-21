# Security Demo

This demo illustrates common web security issues and their fixes for the Iron Dillo website.

## Login Example

| Insecure | Secure |
| --- | --- |
| ```html
<form action="http://example.com/login" method="POST">
  ...
</form>
<script>
const USER = 'admin';
const PASS = 'password123';
document.cookie = "session=abc123";
</script>
``` | ```html
<form action="https://example.com/login" method="POST">
  ...
</form>
<script>
const USER = crypto.randomUUID();
const PASS = crypto.randomUUID();
document.cookie = "session=" + crypto.randomUUID() + "; Secure; SameSite=Strict";
</script>
``` |

Hardcoded credentials, plain HTTP, and an unencrypted cookie expose user data. Using HTTPS, random credentials, and secure cookies protects sessions.

## Contact Form Example

| Insecure | Secure |
| --- | --- |
| ```html
<form action="http://example.com/contact" method="POST">
  ...
</form>
<script>
document.cookie = "prefs=dark";
</script>
``` | ```html
<form action="https://example.com/contact" method="POST">
  ...
</form>
<script>
document.cookie = "prefs=" + encodeURIComponent(JSON.stringify({theme:'dark'})) + "; Secure; SameSite=Lax";
</script>
``` |

Sending form data over HTTP and storing unencrypted cookies allows interception. HTTPS and secure cookies keep information private.

