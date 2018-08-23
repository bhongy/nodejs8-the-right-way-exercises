'use strict';

const assert = require('assert');
const fs = require('fs');
const request = require('request');
const program = require('commander');
const pkg = require('../package.json');
const fullUrl = require('./fullUrl');

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')
  .option('-o, --host <hostname>', 'hostname [localhost]', 'localhost')
  .option('-p, --port <number>', 'port number [9200]', 9200)
  .option('-j, --json', 'format output as JSON')
  .option('-i, --index <name>', 'which index to use')
  .option('-t, --type <type>', 'default type for bulk operations')
  .option('-f, --filter <filter>', 'source filter for query results');

program
  .command('url [path]')
  .description(
    'generate the URL for the options and path (default path is "/")'
  )
  .action((path = '/') => {
    console.log(fullUrl(path));
  });

function handleResponse(err, res, body) {
  if (program.json) {
    console.log(JSON.stringify(err || body));
  } else {
    if (err) {
      throw err;
    }
    console.log(body);
  }
}

program
  .command('get [path]')
  .description('perform an HTTP GET request for path (default path is "/")')
  .action((path = '/') => {
    const options = {
      url: fullUrl(path),
      json: program.json,
    };
    request.get(options, handleResponse);
  });

program
  .command('create-index')
  .description('create an index')
  .action(() => {
    if (!program.index) {
      const msg = 'No index specified! Use --index <name>';
      if (!program.json) {
        throw Error(msg);
      }
      console.log(JSON.stringify({ error: msg }));
      return;
    }

    request.put(fullUrl(), handleResponse);
  });

program
  .command('list-indices')
  .alias('li')
  .description('get a list of indices in this cluster')
  .action(() => {
    const path = program.json ? '_all' : '_cat/indices?v';
    const options = {
      url: fullUrl(path),
      json: program.json,
    };
    request.get(options, handleResponse);
  });

program
  .command('bulk <file>')
  .description('read and perform bulk options from the specified file')
  .action(file => {
    fs.stat(file, (err, stats) => {
      if (err) {
        if (program.json) {
          console.log(JSON.stringify(err));
          return;
        }
        throw err;
      }

      const readStream = fs.createReadStream(file);
      const req = request.post({
        url: fullUrl('_bulk'),
        json: true,
        headers: {
          // content-length is important for streaming
          'content-length': stats.size,
          'content-type': 'application/json',
        },
      });

      readStream.pipe(req);
      req.pipe(process.stdout);
    });
  });

program
  .command('query [queries...]')
  .alias('q')
  .description('perform an Elasticsearch query')
  .action((queries = []) => {
    const qs = {};
    if (queries.length > 0) {
      qs.q = queries.join(' ');
    }
    if (program.filter) {
      qs._source = program.filter;
    }
    const options = {
      url: fullUrl('_search'),
      json: program.json,
      qs,
    };
    request(options, handleResponse);
  });

program
  .command('delete <id>')
  .description('delete a document from an index')
  .action(id => {
    assert.equal(
      typeof program.index,
      'string',
      'index option must be provided'
    );
    const options = { url: fullUrl(id) };
    request.del(options, handleResponse);
  });

program
  .command('put <id>')
  .description('create a new document')
  .action(id => {
    const req = request.put({
      url: fullUrl(id),
      json: true,
      headers: { 'content-type': 'application/json' },
    });
    process.stdin.pipe(req).pipe(process.stdout);
  });

program.parse(process.argv);

const matchedCommands = program.args.filter(arg => typeof arg === 'object');
if (matchedCommands.length === 0) {
  program.help();
}
