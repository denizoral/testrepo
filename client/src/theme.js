import { createTheme } from '@mui/material/styles';

// Using gradients for a more visually interesting background for the glass effect to interact with.
const lightBg = 'linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)';
const darkBg = 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#00796b' }, // A slightly more vibrant teal
          secondary: { main: '#004d40' },
          background: {
            default: '#eceff1', // A softer off-white
            paper: 'rgba(255, 255, 255, 0.7)',
            chat: lightBg,
            blur: {
              backgroundColor: 'rgba(255, 255, 255, 0.6)', // Less opaque
              backdropFilter: 'blur(20px) saturate(180%)', // More blur, add saturation
            }
          },
        }
      : {
          primary: { main: '#26a69a' }, // A nice teal for dark mode
          secondary: { main: '#00796b' },
          background: {
            default: '#121212',
            paper: 'rgba(30, 30, 30, 0.7)',
            chat: darkBg,
            blur: {
              backgroundColor: 'rgba(18, 18, 18, 0.5)', // Less opaque
              backdropFilter: 'blur(20px) saturate(180%)', // More blur, add saturation
            }
          },
        }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 }, // Bolder
    h6: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.palette.background.blur,
          border: `1px solid rgba(${theme.palette.mode === 'light' ? '255,255,255' : '255,255,255'}, 0.2)`,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.palette.background.blur,
          border: `1px solid rgba(${theme.palette.mode === 'light' ? '255,255,255' : '255,255,255'}, 0.2)`,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          borderRadius: '0px',
        }),
      },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
                    borderRadius: '12px',
                },
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '12px',
                }
            }
        }
    }
  }
});
