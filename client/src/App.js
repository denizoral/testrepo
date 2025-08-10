import React, { useState, useEffect, useRef } from 'react';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import Login from './components/Login';
import { getTheme } from './theme';

function App() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const socket = useRef(null);

  const theme = getTheme(darkMode ? 'dark' : 'light');

  useEffect(() => {
    if (loggedIn) {
      socket.current = new WebSocket('ws://localhost:8080');

      socket.current.onopen = () => {
        socket.current.send(JSON.stringify({ type: 'login', username }));
      };

      socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'welcome':
            setCurrentUser(data.user);
            break;
          case 'updateUserList':
            setUsers(data.users);
            break;
          case 'message':
            setMessages(prev => ({
              ...prev,
              [data.senderId]: [...(prev[data.senderId] || []), data],
            }));
            break;
          case 'typing':
            setTypingUsers(prev => ({ ...prev, [data.from]: data.isTyping }));
            break;
          case 'messageStatusUpdate': {
            const { messageId, status } = data;
            // Find which conversation this message belongs to and update it
            let conversationKey = null;
            let messageIndex = -1;

            for (const key in messages) {
                const index = messages[key].findIndex(m => m.id === messageId);
                if (index !== -1) {
                    conversationKey = key;
                    messageIndex = index;
                    break;
                }
            }

            if (conversationKey) {
                setMessages(prev => {
                    const newConversation = [...prev[conversationKey]];
                    newConversation[messageIndex] = { ...newConversation[messageIndex], status };
                    return { ...prev, [conversationKey]: newConversation };
                });
            }
            break;
          }
          default:
            console.log('Unknown message type:', data.type);
        }
      };

      return () => socket.current.close();
    }
  }, [loggedIn, username, messages]);

  const handleLogin = (name) => {
    setUsername(name);
    setLoggedIn(true);
  };

  const handleThemeChange = () => setDarkMode(!darkMode);

  const handleSelectUser = (user) => setSelectedUser(user);

  const sendMessage = (content) => {
    if (selectedUser && content.trim() && currentUser) {
      const message = { type: 'message', to: selectedUser.id, content, timestamp: new Date() };
      socket.current.send(JSON.stringify(message));
      const messageToStore = { ...message, id: new Date().getTime(), senderId: currentUser.id, recipientId: selectedUser.id, status: 'sent' };
      setMessages(prev => ({ ...prev, [selectedUser.id]: [...(prev[selectedUser.id] || []), messageToStore] }));
    }
  };

  const sendTypingStatus = (isTyping) => {
    if (selectedUser) {
      socket.current.send(JSON.stringify({ type: 'typing', to: selectedUser.id, isTyping }));
    }
  };

  const sendMessagesRead = (senderId) => {
      socket.current.send(JSON.stringify({ type: 'messages_read', senderId }));
  }

  if (!loggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        <CssBaseline />
        <Box sx={{ width: '30%', borderRight: `1px solid ${theme.palette.divider}` }}>
          <Sidebar
            currentUser={currentUser}
            onThemeChange={handleThemeChange}
            darkMode={darkMode}
            users={users.filter(u => u.id !== currentUser?.id)}
            onSelectUser={handleSelectUser}
            selectedUser={selectedUser}
          />
        </Box>
        <Box sx={{ width: '70%' }}>
          {selectedUser && currentUser ? (
            <ChatView
              user={selectedUser}
              messages={messages[selectedUser.id] || []}
              onSendMessage={sendMessage}
              currentUser={currentUser}
              onSendTypingStatus={sendTypingStatus}
              isTyping={!!typingUsers[selectedUser.id]}
              onSendMessagesRead={() => sendMessagesRead(selectedUser.id)}
            />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              Select a chat to start messaging
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
