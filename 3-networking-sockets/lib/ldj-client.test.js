'use strict';

const { EventEmitter } = require('events');
const { LDJClient, __private__ } = require('./ldj-client');

describe('LDJClient.connect(stream)', () => {
  let stream = null;
  let client = null;

  beforeEach(() => {
    stream = new EventEmitter();
    client = LDJClient.connect(stream);
  });

  it('emits a message event from a single data event', done => {
    expect.assertions(1);
    client.on('message', data => {
      expect(JSON.parse(data)).toEqual({ foo: 'bar' });
      done();
    });
    stream.emit('data', '{"foo": "bar"}\n');
  });

  it('emits a message event from split data events', done => {
    expect.assertions(1);
    client.on('message', data => {
      expect(JSON.parse(data)).toEqual({ foo: 'bar' });
      done();
    });
    stream.emit('data', '{"foo": ');
    process.nextTick(() => {
      stream.emit('data', '"bar"}\n');
    });
  });

  it('cleans up listeners on the source stream', (done) => {
    expect(stream.listenerCount('data')).toBe(1);
    expect(stream.listenerCount('close')).toBe(1);
    client.on('close', () => {
      expect(stream.listenerCount('data')).toBe(0);
      expect(stream.listenerCount('close')).toBe(0);
      done();
    });
    stream.emit('close');
  })
});

describe('LDJClient.parseBuffer(buffer) [private]', () => {
  const { parseBuffer } = __private__;

  it('handles empty buffer', () => {
    expect(parseBuffer('')).toEqual({
      messages: [],
      partial: '',
    });
  });

  it('handles buffer without messages', () => {
    const buffer = '{"type": "changed", "timesta';
    expect(parseBuffer(buffer)).toEqual({
      messages: [],
      partial: buffer,
    });
  });

  it('handles buffer with messages', () => {
    const buffer = '{"a": 1}\n{"b": true, "c": "foo"}\n{"fizz": "buzz';
    expect(parseBuffer(buffer)).toEqual({
      messages: ['{"a": 1}', '{"b": true, "c": "foo"}'],
      partial: '{"fizz": "buzz',
    });
  });
});
