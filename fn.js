'use strict';

const cls = require('./cls');

let i = 0;

const logMemoryUsage = () => {
  const { heapTotal, heapUsed } = process.memoryUsage();
  console.log(Math.floor((100 * heapUsed) / heapTotal) + '%');
};

module.exports = function() {
  return new Promise(resolve => {
    cls.set('rand', Math.random());

    i += 1;

    if (i % 100 === 0) {
      i = 0;
      logMemoryUsage();
    }

    resolve();
  }, 1000);
};
