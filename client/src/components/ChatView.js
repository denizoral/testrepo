
import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, TextField, Box, AppBar, Toolbar, Avatar, IconButton, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';

const socket = new WebSocket('ws://localhost:8080');

function ChatView({ username }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    };
    return () => socket.onmessage = null;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        username,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      socket.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundImage: theme.palette.background.chat, backgroundColor: theme.palette.background.default }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #ddd' }}>
        <Toolbar>
          <Avatar sx={{ mr: 2 }}>J</Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>John Doe</Typography>
          <IconButton><MoreVertIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box 
              sx={{
                display: 'flex',
                justifyContent: msg.username === username ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Paper 
                elevation={1} 
                sx={{
                  p: '10px 15px',
                  borderRadius: '10px',
                  backgroundColor: msg.username === username ? theme.palette.primary.main : theme.palette.background.paper,
                  color: msg.username === username ? '#fff' : theme.palette.text.primary,
                  maxWidth: '60%',
                }}
              >
                <Typography variant="body1">{msg.content}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: msg.username === username ? '#eee' : 'grey.500' }}>
                  {msg.timestamp}
                </Typography>
              </Paper>
            </Box>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
        <Paper component="form" sx={{ display: 'flex', alignItems: 'center', borderRadius: '20px', p: '2px 4px' }} onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ ml: 2 }}
            InputProps={{ disableUnderline: true }}
          />
          <IconButton color="primary" type="submit">
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
}

export default ChatView;
