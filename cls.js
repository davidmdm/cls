'use strict';

const async_hooks = require('async_hooks');
const fs = require('fs');

const debugMode = process.env.DEBUG;
const debug = str => debugMode && fs.writeSync(1, str + '\n\n');

const ctxMap = new Map();
const typeMap = new Map();
let ID;

function init(asyncId, type, triggerAsyncId) {
  // debug(`${type}: ${asyncId} triggered by ${triggerAsyncId}`);
  if (ctxMap.has(triggerAsyncId)) {
    // debug(`context found... setting ctx to key ${asyncId}`);
    ctxMap.set(asyncId, ctxMap.get(triggerAsyncId));
    typeMap.set(asyncId, type);
  }
}

function destroy(asyncId) {
  if (asyncId === ID) {
    // debug('DESTROYING ROOOOOOOT');
  }

  if (ctxMap.has(asyncId)) {
    // debug(`async resource ${asyncId} destroyed... deleting related ctx`);
    ctxMap.delete(asyncId);
    debug(`context map size after destroy: ${ctxMap.size}`);
    // debug(
    //   JSON.stringify(
    //     [...ctxMap.keys()].reduce((acc, x) => {
    //       acc[x] = typeMap.get(x);
    //       return acc;
    //     }, {}),
    //     null,
    //     4
    //   )
    // );
  }
}

const asyncHook = async_hooks.createHook({
  init,
  destroy,
});

asyncHook.enable();

function run() {
  const id = async_hooks.executionAsyncId();
  ID = id;
  debug(`running cls on executionAsyncId ${id}`);
  ctxMap.set(id, new Map());
}

function get(key) {
  const ctx = ctxMap.get(async_hooks.executionAsyncId());
  return ctx && ctx.get(key);
}

function set(key, value) {
  const ctx = ctxMap.get(async_hooks.executionAsyncId());
  return ctx && ctx.set(key, value);
}

module.exports = {
  get,
  set,
  run,
};
