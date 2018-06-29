'use strict';

const fs = require('fs');
const net = require('net');
const config = require('./config.json');

const filename = process.argv[2];

if (!filename) {
  throw Error('Error: No filename specified.');
}

const encodeJson = payload => `${JSON.stringify(payload)}\n`;
const server = net.createServer(connection => {
  // Reporting
  console.log('Subscriber connected');
  connection.write(encodeJson({ type: 'watching', file: filename }));

  // Watcher setup
  const watcher = fs.watch(filename, () => {
    connection.write(encodeJson({ type: 'changed', timestamp: Date.now() }));
  });

  // Clean up
  connection.on('close', () => {
    console.log('Subscriber disconnected.');
    watcher.close();
  })
});

server.listen(config.port, () => console.log('Listening for subscribers ...'));
