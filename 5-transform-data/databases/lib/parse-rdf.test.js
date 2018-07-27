'use strict';

const { readFileSync } = require('fs');
const parseRDF = require('./parse-rdf');

const rdf = readFileSync(`${__dirname}/__fixtures__/pg132.rdf`, 'utf8');

describe('parseRDF', () => {
  it('is a function', () => {
    expect(typeof parseRDF).toBe('function');
  });

  it('parses RDF content', () => {
    const book = parseRDF(rdf);
    expect(book).toEqual({});
  });
});
