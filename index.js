'use strict';

const async_hooks = require('async_hooks');
const fs = require('fs');
const cjson = require('circular-json');

const idMap = new Map();
const typeMap = new Map();

const log = str => fs.writeSync(1, str + '\n\n');

const inspect = (id, type) => {
  log(`${type.toUpperCase()} => id: ${id} of type ${typeMap.get(id)} with triggerId ${idMap.get(id)}`);

  if (idMap.has(idMap.get(id))) {
    inspect(idMap.get(id), type);
  } else {
    log('---------------------------------------------------------------------');
  }
};

function init(asyncId, type, triggerAsyncId, resource) {
  idMap.set(asyncId, triggerAsyncId);
  typeMap.set(asyncId, type);
  inspect(asyncId, 'inspect');
}

function after(asyncId) {
  inspect(asyncId, 'after');
}
function before(asyncId) {
  inspect(asyncId, 'before');
}
function destroy(asyncId) {
  inspect(asyncId, 'destroy');
}

const asyncHook = async_hooks.createHook({
  init,
  before,
  // after,
  // destroy,
});

asyncHook.enable();

require('http')
  .createServer((req, res) => Promise.resolve(async_hooks.executionAsyncId() + '\n\n').then(x => res.end(x)))
  .listen(3000, () => console.log('listening'));
