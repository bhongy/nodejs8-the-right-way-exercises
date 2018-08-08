'use strict';

const program = require('commander');
const path = require('path');
const url = require('url');

function fullUrl(requestPath = '') {
  const { pathname, query } = url.parse(requestPath, true);
  const { host, port, index, type } = program;
  const segments = [index, type, pathname].filter(Boolean);

  return url.format({
    protocol: 'http',
    hostname: host,
    port,
    pathname: path.join(...segments),
    query,
  });
}

module.exports = fullUrl;
