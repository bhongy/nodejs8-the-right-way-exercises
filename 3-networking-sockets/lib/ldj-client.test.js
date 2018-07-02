'use strict';

const { __private__ } = require('./ldj-client');

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
