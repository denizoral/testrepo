// This file simulates a database for development purposes.
// TODO: Replace the functions in this file with actual database queries (e.g., using Prisma)

const { v4: uuidv4 } = require('uuid');

// --- In-memory data store ---
const users = {}; // Stores user data { id, username, ... }
const messages = []; // Stores all messages
const connections = {}; // Maps userId to a WebSocket connection instance { userId: ws }

// --- User Functions ---

/**
 * Finds a user by their username or creates a new one if not found.
 * @param {string} username - The username to find or create.
 * @returns {object} The user object.
 */
const findOrCreateUser = (username) => {
  const existingUser = Object.values(users).find(u => u.username === username);
  if (existingUser) {
    console.log(`Found existing user: ${username}`);
    return existingUser;
  }

  const newUserId = uuidv4();
  const newUser = {
    id: newUserId,
    username,
    profilePictureUrl: `https://i.pravatar.cc/150?u=${newUserId}`,
    createdAt: new Date(),
  };
  users[newUser.id] = newUser;
  console.log(`Created new user: ${username}`);
  return newUser;
};

/**
 * Gets a user by their ID.
 * @param {string} userId - The ID of the user.
 * @returns {object | undefined} The user object or undefined if not found.
 */
const getUserById = (userId) => users[userId];

/**
 * Gets all users, including their online status.
 * @returns {array} An array of all user objects with an `isOnline` flag.
 */
const getAllUsers = () => {
  return Object.values(users).map(user => ({
    ...user,
    isOnline: connections.hasOwnProperty(user.id),
  }));
};


// --- Connection Functions ---

/**
 * Stores a user's WebSocket connection.
 * @param {string} userId - The ID of the user.
 * @param {object} ws - The WebSocket connection instance.
 */
const addConnection = (userId, ws) => {
  connections[userId] = ws;
  console.log(`Connection added for user: ${userId}`);
};

/**
 * Removes a user's WebSocket connection.
 * @param {string} userId - The ID of the user.
 */
const removeConnection = (userId) => {
  delete connections[userId];
  console.log(`Connection removed for user: ${userId}`);
};

/**
 * Gets a user's WebSocket connection.
 * @param {string} userId - The ID of the user.
 * @returns {object | undefined} The WebSocket connection or undefined.
 */
const getConnection = (userId) => connections[userId];


// --- Message Functions ---

/**
 * Creates and stores a new message.
 * @param {string} senderId - The ID of the sender.
 * @param {string} recipientId - The ID of the recipient.
 * @param {string} content - The message content.
 * @returns {object} The new message object.
 */
const createMessage = (senderId, recipientId, content) => {
  const newMessage = {
    id: uuidv4(),
    senderId,
    recipientId,
    content,
    timestamp: new Date(),
    status: 'sent', // Initial status
  };
  messages.push(newMessage);
  console.log(`Message created from ${senderId} to ${recipientId}`);
  return newMessage;
};

/**
 * Updates the status of a specific message.
 * @param {string} messageId - The ID of the message to update.
 * @param {string} status - The new status ('delivered' or 'read').
 */
const updateMessageStatus = (messageId, status) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
        // Don't downgrade status (e.g., from read to delivered)
        if (message.status === 'read' && status === 'delivered') return;
        message.status = status;
        console.log(`Updated message ${messageId} to status ${status}`);
    }
};

/**
 * Finds all messages sent by a specific user to another user that are not yet read.
 * @param {string} senderId - The ID of the message sender.
 * @param {string} recipientId - The ID of the message recipient (the one who is reading).
 * @returns {array} An array of unread message objects.
 */
const findUnreadMessages = (senderId, recipientId) => {
    return messages.filter(m =>
        m.senderId === senderId &&
        m.recipientId === recipientId &&
        m.status !== 'read'
    );
}

module.exports = {
  findOrCreateUser,
  getUserById,
  getAllUsers,
  addConnection,
  removeConnection,
  getConnection,
  createMessage,
  updateMessageStatus,
  findUnreadMessages,
};
