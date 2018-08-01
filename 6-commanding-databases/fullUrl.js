'use strict';

const { join } = require('path');
const url = require('url');

function fullUrl({ host, port, index, type, path = '' }) {
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
