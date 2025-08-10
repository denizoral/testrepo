import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#00A884' }, // WhatsApp Green
          secondary: { main: '#005C4B' },
          background: {
            default: '#F0F2F5', // Light grey app background
            paper: '#FFFFFF',
            chat: '#EFEAE2', // Classic chat background color
          },
          text: {
            primary: '#111B21',
          },
          message: {
            sent: '#D9FDD3', // Sent message bubble color
          }
        }
      : {
          primary: { main: '#00A884' },
          secondary: { main: '#005C4B' },
          background: {
            default: '#111B21', // Dark grey-blue app background
            paper: '#202C33', // Darker paper color
            chat: '#0b141a', // Dark chat background
          },
          text: {
            primary: '#E9EDEF',
          },
          message: {
            sent: '#005C4B', // Sent message bubble color (dark)
          }
        }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 500 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: '0px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'light' ? '#F0F2F5' : '#202C33',
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#E9EDEF' : 'rgba(255, 255, 255, 0.1)'}`,
        }),
      },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                '&.Mui-selected': {
                    backgroundColor: mode === 'light' ? '#F0F2F5' : '#2A3942',
                },
                '&:hover': {
                    backgroundColor: mode === 'light' ? '#F5F5F5' : '#2A3942',
                }
            }
        }
    }
  }
});
