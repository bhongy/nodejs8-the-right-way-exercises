'use strict';

const fs = require('fs');
const zmq = require('zeromq');

const filename = process.argv[2];
// create the publisher endpoint
const publisher = zmq.socket('pub');

fs.watch(filename, () => {
  const data = JSON.stringify({
    type: 'changed',
    file: filename,
    timestamp: Date.now(),
  });
  publisher.send(data);
});

publisher.bind('tcp://*:60400', err => {
  if (err) {
    throw err;
  }
  console.log('Listening for zmq subscribers ...');
});
