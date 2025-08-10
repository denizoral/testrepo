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
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  } else {
    next();
  }
});


const broadcastUserList = () => {
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
        const senderId = ws.userId;
        if (!senderId && data.type !== 'login') {
            return; // Ignore messages from non-logged-in users
        }

        switch (data.type) {
            case 'login': {
                const user = db.findOrCreateUser(data.username);
                ws.userId = user.id;
                db.addConnection(user.id, ws);
                ws.send(JSON.stringify({ type: 'welcome', user }));
                broadcastUserList();
                break;
            }

            case 'typing': {
                const recipientConn = db.getConnection(data.to);
                if (recipientConn && recipientConn.readyState === WebSocket.OPEN) {
                    recipientConn.send(JSON.stringify({ type: 'typing', from: senderId, isTyping: data.isTyping }));
                }
                break;
            }

            case 'message': {
                const msg = db.createMessage(senderId, data.to, data.content);
                const recipientConn = db.getConnection(data.to);
                if (recipientConn && recipientConn.readyState === WebSocket.OPEN) {
                    recipientConn.send(JSON.stringify({ type: 'message', ...msg }));
                    // Mark as delivered and notify sender
                    db.updateMessageStatus(msg.id, 'delivered');
                    const senderConn = db.getConnection(senderId);
                    if (senderConn && senderConn.readyState === WebSocket.OPEN) {
                        senderConn.send(JSON.stringify({ type: 'messageStatusUpdate', messageId: msg.id, status: 'delivered' }));
                    }
                }
                break;
            }

            case 'messages_read': {
                const readerId = ws.userId; // The one who read the messages
                const originalSenderId = data.senderId; // The one whose messages were read
                const unreadMessages = db.findUnreadMessages(originalSenderId, readerId);

                unreadMessages.forEach(msg => {
                    db.updateMessageStatus(msg.id, 'read');
                    const originalSenderConn = db.getConnection(originalSenderId);
                    if (originalSenderConn && originalSenderConn.readyState === WebSocket.OPEN) {
                        originalSenderConn.send(JSON.stringify({ type: 'messageStatusUpdate', messageId: msg.id, status: 'read' }));
                    }
                });
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
