'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });


wss.on('connection', webSocket => {
  wss.on('message', message => {
    console.log('Received:', message);
    broadcast(message);
  });
});

  wss.on('message', message => {
    console.log('Received:', message);
    broadcast(message);
  });

function broadcast(data) {
  wss.clients.forEach(client => {
      client.send(data);
  });
}

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 5000);


/* esto funcionaba jaja
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);


}*/





