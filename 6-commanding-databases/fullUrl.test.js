'use strict';

jest.mock('commander');

const program = require('commander');
const fullUrl = require('./fullUrl');

describe('fullUrl', () => {
  it('returns the correct result', () => {
    Object.assign(program, {
      host: 'google.com',
      port: 8080,
      index: 'index',
      type: 'book',
    });

    expect(fullUrl('the-lord-of-the-rings')).toBe(
      'http://google.com:8080/index/book/the-lord-of-the-rings'
    );
  });
});
