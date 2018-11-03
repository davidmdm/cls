'use strict';

const async_hooks = require('async_hooks');
const namespaces = new Map();

function createNamespace(name) {
  if (namespaces.has(name)) {
    throw new Error('namespace already exists: ' + name);
  }

  const ctxMap = new Map();

  function get(key) {
    const ctx = ctxMap.get(async_hooks.executionAsyncId());
    return ctx && ctx.get(key);
  }

  function set(key, value) {
    const ctx = ctxMap.get(async_hooks.executionAsyncId());
    return ctx && ctx.set(key, value);
  }

  function run(fn) {
    ctxMap.set(async_hooks.executionAsyncId(), new Map());
    fn();
  }

  function init(asyncId, type, triggerAsyncId) {
    if (ctxMap.has(triggerAsyncId)) {
      ctxMap.set(asyncId, ctxMap.get(triggerAsyncId));
    }
  }

  function destroy(asyncId) {
    if (ctxMap.has(asyncId)) {
      ctxMap.delete(asyncId);
    }
  }

  const asyncHook = async_hooks.createHook({
    init,
    destroy,
  });

  asyncHook.enable();

  const cls = { get, set, run };

  namespaces.set(name, cls);

  return cls;
}

const getNamespace = name => namespaces.get(name);

module.exports = {
  createNamespace,
  getNamespace,
};
