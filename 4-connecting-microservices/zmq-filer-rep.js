'use strict';

const fs = require('fs');
const { promisify } = require('util');
const zmq = require('zeromq');

const readFile = promisify(fs.readFile);
const responder = zmq.socket('rep');

responder.on('message', data => {
  // the incoming message
  const request = JSON.parse(data);
  console.log(`Received request to get: ${request.path}`);

  readFile(request.path)
    .then(content => {
      console.log('Sending response content.');
      const data = JSON.stringify({
        content: content.toString(),
        timestamp: Date.now(),
        pid: process.pid,
      });
      responder.send(data);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
});

responder.bind('tcp://127.0.0.1:60401', err => {
  console.log('Listening for zmq requesters ...');
});

// ask responder to gracefully close all outstanding connections
// when the Node process ends (receives interrupt signal)
process.on('SIGINT', () => {
  console.log('Shutting down ...');
  responder.close();
});
