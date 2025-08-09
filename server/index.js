const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

console.log('Starting server...');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get(/.*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const users = {};

const broadcastUserList = () => {
  console.log('Broadcasting user list...');
  const userList = Object.keys(users).map(userId => ({
    userId,
    username: users[userId].username,
  }));
  console.log('User list:', userList);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'updateUserList', users: userList }));
    }
  });
  console.log('User list broadcasted.');
};

wss.on('connection', (ws) => {
  const userId = uuidv4();
  users[userId] = { ws, username: null };
  console.log(`User ${userId} connected`);

  ws.send(JSON.stringify({ type: 'welcome', userId }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log(`Received message => ${message}`);

    switch (data.type) {
      case 'login':
        console.log(`Login message from ${data.username} (userId: ${userId})`);
        users[userId].username = data.username;
        broadcastUserList();
        break;
      case 'message':
        const recipient = users[data.to];
        if (recipient && recipient.ws.readyState === WebSocket.OPEN) {
          recipient.ws.send(JSON.stringify({
            type: 'message',
            from: userId,
            content: data.content,
            timestamp: data.timestamp,
          }));
        }
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  });

  ws.on('close', () => {
    delete users[userId];
    broadcastUserList();
    console.log(`User ${userId} disconnected`);
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
