
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const users = {};
const messages = {};

wss.on('connection', (ws) => {
  const userId = uuidv4();
  users[userId] = ws;
  console.log(`User ${userId} connected`);

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    delete users[userId];
    console.log(`User ${userId} disconnected`);
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
