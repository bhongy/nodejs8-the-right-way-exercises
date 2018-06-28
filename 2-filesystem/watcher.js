'use strict';

const fs = require('fs');

fs.watch('target.txt', () => {
  const timestamp = new Date();
  const formattedTime = timestamp.toLocaleString();
  console.log(`[${formattedTime}] File changed!`);
});

console.log('Now watching target.txt for changes ...');