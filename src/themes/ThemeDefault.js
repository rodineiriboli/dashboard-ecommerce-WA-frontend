import { createTheme } from '@mui/material';

const palette = {
  mode: 'light',
  primary: {
    main: '#6699ff',
    contrastText: '#ffffff'
  },
  background: {
    default: '#ffffff'
  }
}

const theme = createTheme({
  palette
});

export default theme;