'use strict';

const net = require('net');
const config = require('./config.json');

const client = net.connect({ port: config.port });

/**
 * takes parsed message and create 
 */
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

client.on('data', data => {
  const o = JSON.parse(data); // protocol, client knows it'll get strigified JSON
  const output = getOutput(o.type, {
    file: o.file,
    timestamp: o.timestamp,
  });
  console.log(output);
});