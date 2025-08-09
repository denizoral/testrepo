import React from 'react';
import { List, ListItem, ListItemText, Avatar, Paper, Typography, TextField, InputAdornment, AppBar, Toolbar, IconButton, Switch, Box, ListItemButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function Sidebar({ username, onThemeChange, darkMode, users, onSelectUser, selectedUser }) {
  return (
    <Box sx={{ p: 1, height: '100%' }}>
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Avatar sx={{ mr: 2 }}>{username.charAt(0).toUpperCase()}</Avatar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>{username}</Typography>
            <Switch checked={darkMode} onChange={onThemeChange} />
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search or start new chat"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: '20px' }
            }}
          />
        </Box>
        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {users.map((user) => (
            <ListItemButton
              key={user.userId}
              selected={selectedUser?.userId === user.userId}
              onClick={() => onSelectUser(user)}
            >
              <Avatar sx={{ mr: 2 }}>{user.username.charAt(0).toUpperCase()}</Avatar>
              <ListItemText primary={user.username} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Sidebar;
