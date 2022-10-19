import { CssBaseline, ThemeProvider} from '@mui/material';
import DrawerBase from './layout/DrawerBase';
import theme from './themes/ThemeDefault';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <DrawerBase />
    </ThemeProvider>
  );
}

export default App;
