
import React, { useState } from 'react';
import { Button, TextField, Container, Card, CardContent, Typography, Avatar } from '@mui/material';
import Chat from '@mui/icons-material/Chat';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '100px' }}>
      <Card elevation={5}>
        <CardContent style={{ textAlign: 'center' }}>
          <Avatar style={{ margin: '0 auto 20px', backgroundColor: '#128C7E' }}>
            <Chat />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Welcome to ChatApp
          </Typography>
          <TextField
            label="Enter your username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth 
            onClick={handleLogin} 
            style={{ marginTop: '20px' }}
          >
            Join Chat
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;
