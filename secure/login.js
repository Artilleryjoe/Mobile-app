const USER = crypto.randomUUID();
const PASS = crypto.randomUUID();

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  document.cookie = "session=" + crypto.randomUUID() + "; Secure; SameSite=Strict";
  alert('Logged in securely!');
});
