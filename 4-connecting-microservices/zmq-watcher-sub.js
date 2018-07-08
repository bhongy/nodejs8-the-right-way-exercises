'use strict';

const zmq = require('zeromq');

// create subscriber endpoint
const subscriber = zmq.socket('sub');

// subscribe to all message
const messageFilter = '';
subscriber.subscribe(messageFilter);

subscriber.on('message', data => {
  const message = JSON.parse(data);
  const date = new Date(message.timestamp);
  console.log(`File "${message.file}" changed at ${date}`);
});

subscriber.connect('tcp://localhost:60400');
