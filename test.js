'use strict';

const cls = require('./cls');
const storage = cls.createNamespace('test');

const fn = require('./fn');

require('http')
  .createServer((req, res) => {
    fn().then(() => {
      console.log(storage.get('rand'));
      res.end('' + storage.get('rand') + '\n');
    });
  })
  .listen(3000, () => console.log('listening'));
