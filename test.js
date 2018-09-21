'use strict';

const cls = require('./cls');
const fn = require('./fn');

require('http')
  .createServer((req, res) => {
    cls.run();

    fn().then(() => {
      res.end('' + cls.get('rand') + '\n');
    });
  })
  .listen(3000, () => console.log('listening'));
