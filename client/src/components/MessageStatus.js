import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function MessageStatus({ status }) {
  if (status === 'sent') {
    return <DoneIcon data-testid="sent-icon" sx={{ fontSize: '16px', color: 'grey.500' }} />;
  }
  if (status === 'delivered') {
    return <DoneAllIcon data-testid="delivered-icon" sx={{ fontSize: '16px', color: 'grey.500' }} />;
  }
  if (status === 'read') {
    // This color would typically come from the theme, e.g., theme.palette.info.main
    return <DoneAllIcon data-testid="read-icon" sx={{ fontSize: '16px', color: '#4FC3F7' }} />;
  }
  return null; // Don't render anything for incoming messages
}

export default MessageStatus;
