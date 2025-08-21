const fs = require('fs');
const path = require('path');

function loadCommands() {
  const yaml = fs.readFileSync(path.join(__dirname, 'commands.yaml'), 'utf8');
  const lines = yaml.split(/\r?\n/);
  const commands = [];
  let current = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('- command:')) {
      if (current) commands.push(current);
      current = { command: trimmed.split(':')[1].trim() };
    } else if (trimmed.startsWith('category:')) {
      if (current) current.category = trimmed.split(':')[1].trim();
    } else if (trimmed.startsWith('lab_scopes:')) {
      if (current) {
        const list = trimmed.substring('lab_scopes:'.length).trim();
        current.lab_scopes = list
          .replace(/\[|\]/g, '')
          .split(',')
          .map(s => s.trim());
      }
    }
  }
  if (current) commands.push(current);
  return commands;
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
