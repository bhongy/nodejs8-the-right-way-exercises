'use strict';

jest.mock('commander');

const program = require('commander');
const fullUrl = require('./fullUrl');

describe('fullUrl', () => {
  beforeEach(() => {
    Object.assign(program, { host: null, port: null, index: null, type: null });
  });

  it('returns the correct path when no optional options are provided', () => {
    Object.assign(program, { host: 'example.com' });
    expect(fullUrl('harry-potter')).toBe('http://example.com/harry-potter');
  });

  it('returns the correct path with index but no type', () => {
    Object.assign(program, { host: 'example.com', index: 'i318' });
    expect(fullUrl('harry-potter')).toBe(
      'http://example.com/i318/harry-potter'
    );
  });

  it('returns the correct path with type but no index', () => {
    Object.assign(program, { host: 'example.com', type: 'movies' });
    expect(fullUrl('harry-potter')).toBe(
      'http://example.com/movies/harry-potter'
    );
  });

  it('returns the correct path when all options are provided', () => {
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
