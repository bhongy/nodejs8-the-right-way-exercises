#!/usr/bin/env node
'use strict';

const fs = require('fs');
const filename = process.argv[2];

fs.createReadStream(filename).pipe(process.stdout);