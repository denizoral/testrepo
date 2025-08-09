
import React from 'react';
import { List, ListItem, ListItemText, Avatar, Paper, Typography, TextField, InputAdornment, AppBar, Toolbar, IconButton, Switch } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const contacts = [
  { id: 1, name: 'John Doe', avatar: 'J', lastMessage: 'See you tomorrow!' },
  { id: 2, name: 'Jane Smith', avatar: 'S', lastMessage: 'Okay, sounds good.' },
];

function Sidebar({ username, onThemeChange, darkMode }) {
  return (
    <Paper elevation={0} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="default" elevation={0} style={{ borderBottom: '1px solid #ddd' }}>
        <Toolbar>
          <Avatar style={{ marginRight: '10px' }}>{username.charAt(0).toUpperCase()}</Avatar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>{username}</Typography>
          <Switch checked={darkMode} onChange={onThemeChange} />
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '10px' }}>
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
            style: { borderRadius: '20px' }
          }}
        />
      </div>
      <List style={{ flexGrow: 1, overflowY: 'auto' }}>
        {contacts.map((contact) => (
          <ListItem button key={contact.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <Avatar style={{ marginRight: '15px' }}>{contact.avatar}</Avatar>
            <ListItemText 
              primary={contact.name} 
              secondary={contact.lastMessage} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default Sidebar;
