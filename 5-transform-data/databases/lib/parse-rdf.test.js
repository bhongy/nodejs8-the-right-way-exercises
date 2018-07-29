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
    expect(book).toEqual({
      id: 132,
      title: 'The Art of War',
      authors: ['Giles, Lionel', 'Sunzi, active 6th century B.C.'],
      subjects: [
        'Military art and science -- Early works to 1800',
        'War -- Early works to 1800',
      ],
    });
  });
});
