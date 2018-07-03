'use strict';

const net = require('net');
const config = require('./config.json');
const { LDJClient } = require('./lib/ldj-client.js');

function getOutput(type, data) {
  switch (type) {
    case 'watching':
      return `Now watching: ${data.file}`;
    case 'changed':
      const date = new Date(data.timestamp);
      return `File changed: ${date}`;
    default:
      return `Unrecognized message type: ${type}`;
  }  
}

const netConnection = net.connect({ port: config.port });
LDJClient.connect(netConnection).on('message', data => {
  const o = JSON.parse(data); // protocol, client knows it'll get strigified JSON
  const output = getOutput(o.type, {
    file: o.file,
    timestamp: o.timestamp,
  });
  console.log(output);
});
