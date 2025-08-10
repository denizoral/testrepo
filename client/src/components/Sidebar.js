import React from 'react';
import { List, ListItemText, Avatar, Paper, Typography, TextField, InputAdornment, AppBar, Toolbar, IconButton, Switch, Box, ListItemButton, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

function Sidebar({ currentUser, onThemeChange, darkMode, users, onSelectUser, selectedUser }) {
  const username = currentUser?.username || '';
  return (
    <Box sx={{ p: 1, height: '100%' }}>
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Avatar sx={{ mr: 2 }} src={currentUser?.profilePictureUrl}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
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
              key={user.id}
              selected={selectedUser?.id === user.id}
              onClick={() => onSelectUser(user)}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                invisible={!user.isOnline}
                sx={{ mr: 2 }}
              >
                <Avatar src={user.profilePictureUrl}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </StyledBadge>
              <ListItemText primary={user.username} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Sidebar;
