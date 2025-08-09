
import React, { useState } from 'react';
import { Grid, CssBaseline, ThemeProvider, Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import Login from './components/Login';
import { getTheme } from './theme';

function App() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const theme = getTheme(darkMode ? 'dark' : 'light');

  const handleLogin = (name) => {
    setUsername(name);
    setLoggedIn(true);
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
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
          <Sidebar username={username} onThemeChange={handleThemeChange} darkMode={darkMode} />
        </Box>
        <Box sx={{ width: '70%' }}>
          <ChatView username={username} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

