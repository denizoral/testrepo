import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, TextField, Box, AppBar, Toolbar, Avatar, IconButton, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';
import MessageStatus from './MessageStatus';

function ChatView({ user, messages, onSendMessage, currentUser, onSendTypingStatus, isTyping, onSendMessagesRead }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // When messages change, if the last message is from the other user, mark as read.
    if (messages.length > 0 && messages[messages.length - 1].senderId === user.id) {
        onSendMessagesRead();
    }
  }, [messages, user.id, onSendMessagesRead]);

  useEffect(() => {
    if (newMessage) {
      onSendTypingStatus(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => onSendTypingStatus(false), 2000);
    } else {
      onSendTypingStatus(false);
    }
    return () => clearTimeout(typingTimeoutRef.current);
  }, [newMessage, onSendTypingStatus]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onSendTypingStatus(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: theme.palette.background.chat }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Avatar sx={{ mr: 2 }} src={user.profilePictureUrl}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{user.username}</Typography>
            {isTyping && <Typography variant="caption" sx={{ color: 'primary.main' }}>typing...</Typography>}
          </Box>
          <IconButton><MoreVertIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ display: 'flex', justifyContent: msg.senderId === currentUser.id ? 'flex-end' : 'flex-start', mb: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  p: '6px 12px',
                  borderRadius: '7px',
                  boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)',
                  backgroundColor: msg.senderId === currentUser.id ? theme.palette.message.sent : theme.palette.background.paper,
                  color: theme.palette.mode === 'light' ? '#111B21' : '#E9EDEF',
                  maxWidth: '65%',
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{msg.content}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mr: 0.5 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  {msg.senderId === currentUser.id && <MessageStatus status={msg.status} />}
                </Box>
              </Paper>
            </Box>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ p: 2, bgcolor: 'background.default', borderTop: `1px solid ${theme.palette.divider}` }}>
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
