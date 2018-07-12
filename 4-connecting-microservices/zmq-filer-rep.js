'use strict';

const fs = require('fs');
const { promisify } = require('util');
const zmq = require('zeromq');

const readFile = promisify(fs.readFile);
const responder = zmq.socket('rep');

responder.on('message', data => {
  // the incoming message
  Promise.resolve(JSON.parse(data))
    .then(request => {
      if (typeof request.path !== 'string') {
        throw new Error('Path must be provided.');
      }

      console.log(`Received request to get: ${request.path}`);
      return request;
    })
    .then(
      request => {
        return readFile(request.path)
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
            responder.send(JSON.stringify(`Cannot read file: ${request.path}`));
          });
      },
      err => {
        responder.send(JSON.stringify(err.message));
      }
    );
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
