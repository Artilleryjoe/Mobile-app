const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadCommands() {
  const file = fs.readFileSync(path.join(__dirname, 'commands.yaml'), 'utf8');
  return yaml.load(file);
}

const commandMeta = loadCommands();

function dispatch(input, scope, mode = 'beginner') {
  const [cmd] = (input || '').trim().split(/\s+/);
  const meta = commandMeta.find(c => c.command === cmd);
  if (!meta) {
    if (mode === 'beginner') {
      return { output: '', hint: 'Unknown command. Type "help" for options.' };
    }
    return { output: '' };
  }
  if (!meta.lab_scopes.includes(scope)) {
    if (mode === 'beginner') {
      return { output: '', hint: `"${cmd}" is not available in this lab.` };
    }
    return { output: '' };
  }
  return { output: meta.output, why: meta.why };
}

if (require.main === module) {
  const [input, scope, mode] = process.argv.slice(2);
  const message = dispatch(input, scope, mode);
  console.log(JSON.stringify(message, null, 2));
}

module.exports = { dispatch };
