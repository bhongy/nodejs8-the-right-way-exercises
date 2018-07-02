'use strict';

const { EventEmitter } = require('events');

/**
 * Take the current buffer and parse for array of full messages (if any)
 * and leftover buffer. Do not parse messages (assume message are json)
 * in this function.
 */
function parseBuffer(buffer) {
  const DELIMITER = '\n';
  const parts = buffer.split(DELIMITER);
  const last = parts.pop(); // mutation
  return {
    messages: parts,
    partial: last,
  };
}

class LDJClient extends EventEmitter {
  static connect(stream) {
    return new LDJClient(stream);
  }

  constructor(stream) {
    super();
    this.buffer = '';
    stream.on('data', this.handleData.bind(this));
  }

  handleData(data) {
    const { messages, partial } = parseBuffer(this.buffer + data);
    this.buffer = partial;
    messages.forEach(msg => {
      this.emit('message', msg);
    });
  }
}

module.exports = {
  LDJClient,
  __private__: {
    parseBuffer,
  },
};

/*
Original
---
module.exports = class LDJClient extends EventEmitter {
  static connect(stream) {
    return new LDJClient(stream);
  }

  constructor(stream) {
    super();
    let buffer = '';
    stream.on('data', data => {
      buffer += data;
      let boundary = buffer.indexOf('\n');
      while (boundary !== -1) {
        const input = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 1);
        this.emit('message', JSON.parse(input));
        boundary = buffer.indexOf('\n');
      }
    });
  }
}
*/
