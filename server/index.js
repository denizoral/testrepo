const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const db = require('./db');

console.log('Starting server...');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the built React client
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
// All other GET requests not handled by express.static will return the React app
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  } else {
    next();
  }
});


/**
 * Broadcasts the current user list to all connected clients.
 */
const broadcastUserList = () => {
    console.log('Broadcasting user list...');
    const users = db.getAllUsers();
    users.forEach(user => {
        const conn = db.getConnection(user.id);
        if (conn && conn.readyState === WebSocket.OPEN) {
            conn.send(JSON.stringify({ type: 'updateUserList', users }));
        }
    });
};

wss.on('connection', (ws) => {
    console.log('A client connected.');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received message:', data);

        switch (data.type) {
            case 'login': {
                const user = db.findOrCreateUser(data.username);
                ws.userId = user.id; // Attach userId to the ws connection for later reference
                db.addConnection(user.id, ws);

                // Send welcome message to the newly logged-in user
                ws.send(JSON.stringify({ type: 'welcome', user }));

                // Broadcast updated user list to everyone
                broadcastUserList();
                break;
            }

            case 'message': {
                const senderId = ws.userId;
                const recipientId = data.to;
                if (!senderId) {
                    return; // Should not happen if client follows protocol
                }

                const msg = db.createMessage(senderId, recipientId, data.content);

                const recipientConn = db.getConnection(recipientId);
                if (recipientConn && recipientConn.readyState === WebSocket.OPEN) {
                    recipientConn.send(JSON.stringify({
                        type: 'message',
                        ...msg
                    }));
                }
                break;
            }

            default:
                console.log('Unknown message type:', data.type);
        }
    });

    ws.on('close', () => {
        console.log('A client disconnected.');
        if (ws.userId) {
            db.removeConnection(ws.userId);
            // Broadcast updated user list to everyone
            broadcastUserList();
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
