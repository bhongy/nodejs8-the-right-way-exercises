'use strict';

const fullUrl = require('./fullUrl');

describe('fullUrl', () => {
  it('returns correct result', () => {
    const url = {
      host: 'google.com',
      port: 8080,
      index: 'index',
      type: 'book',
      path: 'the-lord-of-the-rings',
    };

    expect(fullUrl(url)).toBe(
      'http://google.com:8080/index/book/the-lord-of-the-rings'
    );
  });
});
