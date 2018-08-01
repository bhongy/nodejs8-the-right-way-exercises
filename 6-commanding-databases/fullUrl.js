'use strict';

const program = require('commander');
const { join } = require('path');
const url = require('url');

function fullUrl(path = '') {
  const { host, port, index, type } = program;
  const segments = [index, type, path].filter(Boolean);
  const pathname = join(...segments);

  return url.format({
    protocol: 'http',
    hostname: host,
    port,
    pathname,
  });
}

module.exports = fullUrl;
