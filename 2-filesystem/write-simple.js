'use strict';

const fs = require('fs');

const content = `1) The quick brown fox jumps over the lazy dog.
2) The quick brown fox jumps over the lazy dog.
3) The quick brown fox jumps over the lazy dog.`;

fs.writeFile('target.txt', content, (err) => {
  if (err) {
    throw err;
  }
  console.log('File saved!');
});