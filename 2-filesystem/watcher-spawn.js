'use strict';

const { spawn } = require('child_process');
const fs = require('fs');

// argv => argument vector
const filename = process.argv[2];

if (!filename) {
  throw Error('A file to watch must be specified!');
}

fs.watch(filename, () => {
  const ls = spawn('ls', ['-l', '-h', filename]);
  ls.stdout.pipe(process.stdout);
});

console.log(`Now watching ${filename} for changes ...`);