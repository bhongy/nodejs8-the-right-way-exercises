'use strict';

const fs = require('fs');

// argv => argument vector
const filename = process.argv[2];

if (!filename) {
  throw Error('A file to watch must be specified!');
}

fs.watch(filename, (eventType, filename) => {
  const timestamp = new Date();
  const formattedTime = timestamp.toLocaleString();
  console.log(`[${formattedTime}] File changed!`);
});

console.log(`Now watching ${filename} for changes ...`);