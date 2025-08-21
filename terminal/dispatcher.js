const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadCommands() {
  const file = fs.readFileSync(path.join(__dirname, 'commands.yaml'), 'utf8');
  return yaml.load(file);
}

const commandMeta = loadCommands();

function dispatch(cmd, scope) {
  const meta = commandMeta.find(c => c.command === cmd);
  if (!meta) {
    const categories = [...new Set(commandMeta.map(c => c.category))];
    return `Unknown command "${cmd}". Try one from categories: ${categories.join(', ')}`;
  }
  if (!meta.lab_scopes.includes(scope)) {
    return `The "${cmd}" command is not available in the "${scope}" lab. It belongs to "${meta.category}" and works in: ${meta.lab_scopes.join(', ')}`;
  }
  return `Executing ${cmd}...`;
}

if (require.main === module) {
  const [cmd, scope] = process.argv.slice(2);
  const message = dispatch(cmd, scope);
  console.log(message);
}

module.exports = { dispatch };
