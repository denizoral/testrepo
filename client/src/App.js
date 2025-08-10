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
  const socket = useRef(null);

  const theme = getTheme(darkMode ? 'dark' : 'light');

  useEffect(() => {
    if (loggedIn) {
      socket.current = new WebSocket('ws://localhost:8080');

      socket.current.onopen = () => {
        console.log('WebSocket connected, sending login...');
        socket.current.send(JSON.stringify({ type: 'login', username }));
      };

      socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message from server:', data);
        switch (data.type) {
          case 'welcome':
            setCurrentUser(data.user);
            break;
          case 'updateUserList':
            setUsers(data.users);
            break;
          case 'message':
            setMessages(prevMessages => ({
              ...prevMessages,
              [data.senderId]: [...(prevMessages[data.senderId] || []), data],
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
    if (selectedUser && content.trim() && currentUser) {
      const message = {
        type: 'message',
        to: selectedUser.id,
        content,
        timestamp: new Date(), // Use full date object
      };
      console.log('Sending message:', message);
      socket.current.send(JSON.stringify(message));

      const messageToStore = {
        ...message,
        id: new Date().getTime(), // temp id
        senderId: currentUser.id,
        recipientId: selectedUser.id,
      }

      setMessages(prevMessages => ({
        ...prevMessages,
        [selectedUser.id]: [...(prevMessages[selectedUser.id] || []), messageToStore],
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
      <Box sx={{ display: 'flex', height: '100vh', background: theme.palette.background.chat }}>
        <CssBaseline />
        <Box sx={{ width: '30%' }}>
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
