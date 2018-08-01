'use strict';

const path = require('path');
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
