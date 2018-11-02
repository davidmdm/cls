'use strict';

const cls = require('./cls');

const storage = cls.get('test');

let i = 0;

const logMemoryUsage = () => {
  const { heapTotal, heapUsed } = process.memoryUsage();
  console.log(Math.floor((100 * heapUsed) / heapTotal) + '%');
};

module.exports = function() {
  return new Promise(resolve =>
    setTimeout(() => {
      storage.set('rand', Math.random());
      resolve();
    }, 1000)
  );
};
