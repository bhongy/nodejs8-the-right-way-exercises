'use strict';

const cheerio = require('cheerio');

const parseRDF = rdf => {
  const $ = cheerio.load(rdf);
  const book = {};

  book.id = +$('pgterms\\:ebook')
    .attr('rdf:about')
    .replace('ebooks/', '');

  book.title = $('dcterms\\:title').text();

  book.authors = $('pgterms\\:agent pgterms\\:name')
    .toArray()
    .map(el => $(el).text());

  book.subjects = $('dcam\\:memberOf')
    .filter((i, el) =>
      $(el)
        .attr('rdf:resource')
        .endsWith('/LCSH')
    )
    .parent()
    .find('rdf\\:value')
    .toArray()
    .map(el => $(el).text());

  return book;
};

module.exports = parseRDF;
