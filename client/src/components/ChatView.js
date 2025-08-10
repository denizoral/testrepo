import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, TextField, Box, AppBar, Toolbar, Avatar, IconButton, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';

function ChatView({ user, messages, onSendMessage, currentUser }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundImage: theme.palette.background.chat }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Avatar sx={{ mr: 2 }} src={user.profilePictureUrl}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{user.username}</Typography>
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
                justifyContent: msg.senderId === currentUser.id ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: '10px 15px',
                  borderRadius: '20px',
                  backgroundColor: msg.senderId === currentUser.id ? theme.palette.primary.main : theme.palette.background.paper,
                  color: msg.senderId === currentUser.id ? '#fff' : theme.palette.text.primary,
                  maxWidth: '60%',
                }}
              >
                <Typography variant="body1">{msg.content}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: msg.senderId === currentUser.id ? '#eee' : 'grey.500' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>
            </Box>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ p: 2 }}>
        <Paper component="form" sx={{ display: 'flex', alignItems: 'center', borderRadius: '20px', p: '2px 4px' }} onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
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
