/**
 * Design:
 * - master creates Router and Dealer sockets
 * - master spins up workers
 *   - each worker create a Responder socket that connects back to the Dealer
 */

'use strict';

const cluster = require('cluster');
const fs = require('fs');
const { promisify } = require('util');
const zmq = require('zeromq');

const ROUTER_ENDPOINT = 'tcp://127.0.0.1:60401';
const DEALER_ENDPOINT = 'ipc://filer-dealer.ipc'; // inter-process connection uses unix socket

const readFile = promisify(fs.readFile);
// spinning up one worker per CPU is a good rule of thumb (so what I've been told)
// too many puts overhead on OS to switch between them
// too few misses maximum CPU utilization
const numWorkers = require('os').cpus().length;

if (cluster.isMaster) {
  // master process creates Router and Dealer sockets and binds endpoints.
  const router = zmq.socket('router').bind(ROUTER_ENDPOINT);
  const dealer = zmq.socket('dealer').bind(DEALER_ENDPOINT);

  // forward messages between the router and dealer
  router.on('message', (...frames) => {
    dealer.send(frames);
  });
  dealer.on('message', (...frames) => {
    router.send(frames);
  });

  // listen for workers to come online
  cluster.on('online', worker => {
    console.log(`Worker ${worker.process.pid} is online.`);
  });

  // fork a worker process for each CPU
  console.log(`Spinning up ${numWorkers} worker processes ...`);
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  // worker
} else {
  // worker processes create a Responder (REP) socket and connect to the Dealer
  const responder = zmq.socket('rep').connect(DEALER_ENDPOINT);

  responder.on('message', data => {
    const request = JSON.parse(data);
    console.log(`${process.pid} received request for: ${request.path}`);

    readFile(request.path)
      .then(content => {
        console.log(`${process.pid} sending response`);
        const data = JSON.stringify({
          content: content.toString(),
          timestamp: Date.now(),
          pid: process.pid,
        });
        responder.send(data);
      })
      .catch(err => {
        console.error(`Worker ${process.pid} error.`);
        console.error(err);
        process.exit(1);
      });
  });
}
