const assert = require('assert');
const d = require('./dispatcher');

let r = d.dispatch('help', 'xss-reflected-101');
assert.ok(r.output.includes('Available'));

r = d.dispatch('unknown', 'xss-reflected-101');
assert.ok(r.hint);

r = d.dispatch('curl', 'otherlab', 'beginner');
assert.ok(r.hint);

r = d.dispatch('unknown', 'xss-reflected-101', 'advanced');
assert.strictEqual(r.hint, undefined);

console.log('tests passed');
