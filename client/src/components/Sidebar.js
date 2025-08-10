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
  },
}));

function Sidebar({ currentUser, onThemeChange, darkMode, users, onSelectUser, selectedUser }) {
  const username = currentUser?.username || '';
  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <AppBar position="static" elevation={0}>
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
      <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search or start new chat"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: 'background.paper',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
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
  );
}

export default Sidebar;
