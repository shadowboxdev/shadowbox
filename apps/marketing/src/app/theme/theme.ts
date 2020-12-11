import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colors.pink[700]
    },
    secondary: {
      main: colors.indigo[500]
    }
  },
  shadows,
  typography
});
