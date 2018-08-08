'use strict';

// const fs = require('fs');
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
  .option('-t, --type <type>', 'default type for bulk operations');

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

program.parse(process.argv);

const matchedCommands = program.args.filter(arg => typeof arg === 'object');
if (matchedCommands.length === 0) {
  program.help();
}
