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
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const socket = useRef(null);

  const theme = getTheme(darkMode ? 'dark' : 'light');

  useEffect(() => {
    if (loggedIn) {
      socket.current = new WebSocket('ws://localhost:8080');

      socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message from server:', data);
        switch (data.type) {
          case 'welcome':
            setUserId(data.userId);
            console.log('Sending login message for', username);
            socket.current.send(JSON.stringify({ type: 'login', username }));
            break;
          case 'updateUserList':
            setUsers(data.users);
            break;
          case 'message':
            setMessages(prevMessages => ({
              ...prevMessages,
              [data.from]: [...(prevMessages[data.from] || []), data],
            }));
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      };

      return () => {
        socket.current.close();
      };
    }
  }, [loggedIn, username]);

  const handleLogin = (name) => {
    setUsername(name);
    setLoggedIn(true);
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const sendMessage = (content) => {
    if (selectedUser && content.trim()) {
      const message = {
        type: 'message',
        to: selectedUser.userId,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      console.log('Sending message:', message);
      socket.current.send(JSON.stringify(message));
      setMessages(prevMessages => ({
        ...prevMessages,
        [selectedUser.userId]: [...(prevMessages[selectedUser.userId] || []), { ...message, from: userId }],
      }));
    }
  };

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
        <Box sx={{ width: '30%', borderRight: '1px solid #ddd' }}>
          <Sidebar
            username={username}
            onThemeChange={handleThemeChange}
            darkMode={darkMode}
            users={users.filter(u => u.userId !== userId)}
            onSelectUser={handleSelectUser}
            selectedUser={selectedUser}
          />
        </Box>
        <Box sx={{ width: '70%' }}>
          {selectedUser ? (
            <ChatView
              user={selectedUser}
              messages={messages[selectedUser.userId] || []}
              onSendMessage={sendMessage}
              currentUser={{ userId, username }}
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
