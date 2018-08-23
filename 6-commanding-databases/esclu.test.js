'use strict';

jest.mock('request');

const path = require('path');
const request = require('request');
const child_process = require('child_process');
const { promisify } = require('util');
const execFile = promisify(child_process.execFile);
const esclu = path.join(__dirname, 'esclu');

describe('esclu CLI', () => {
  it('supports looking up version', async () => {
    expect.assertions(1);
    const args = ['-V'];
    const { stdout } = await execFile(esclu, args);
    expect(stdout).toContain('1.0.0');
  });

  it('supports url command', async () => {
    expect.assertions(1);
    const command = 'url';
    const path = 'chocolate-cake';
    const args = [command, path];
    const { stdout } = await execFile(esclu, args);
    expect(stdout).toContain('http://localhost:9200/chocolate-cake');
  });

  // test currently failing because jest doesn't mock "request" module correctly
  // (it hits the real endpoint) maybe because it gets invoked
  // via child_process.exec ?
  it('supports get command', async () => {
    expect.assertions(1);

    request.get.mockImplementation((options, cb) => {
      cb(null, {}, { foo: 'bar' });
    });
      
    const command = 'get';
    const path = 'fruit-smoothie';
    const args = [command, path];
    const { stdout } = await execFile(esclu, args);
    expect(stdout).toContain('{"foo": "bar"}');
  });

  // but this passes
  it('... TEMPORARY ... check "request" is mocked', done => {
    request.get.mockImplementation((options, cb) => {
      cb(null, {}, { foo: 'bar' });
    });
    const options = {
      url: 'http://localhost:9200/fruit-smoothie',
      json: undefined,
    };
    request.get(options, (err, socket, data) => {
      expect(data).toEqual({ foo: 'bar' });
      done();
    });
  });

  it('throws when passing unsupported option', async () => {
    expect.assertions(1);
    const args = ['-v'];
    try {
      await execFile(esclu, args);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
