import React from 'react';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Theme, createMuiTheme, makeStyles, createStyles, ThemeProvider } from '@material-ui/core/styles';

import "./app.scss";

import MainAppBar from './layout/app-bar/app-bar';
import { AppDrawer } from './layout/drawer/drawer';
import { renderRoutes } from './routes';
import { marketingActions, selectDrawerOpen } from './marketing.slice';
import GlobalStyles from './common/styles';
import { darkTheme } from './theme/theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      width: '100%'
    },
    toolbar: {
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    },
  }),
);


export function App({ open, toggleDrawer }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // const theme: Theme = React.useMemo(
  //   () => darkTheme,
  //   [],
  // );
  const theme: Theme = darkTheme;

  const classes = useStyles(darkTheme);

  const handleDrawerOpen = () => {
    toggleDrawer(true);
  };

  const handleDrawerClose = () => {
    toggleDrawer(false);
  };


  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CssBaseline />
      <MainAppBar open={open} drawerOpened={handleDrawerOpen}></MainAppBar>
      <AppDrawer open={open} drawerClosed={handleDrawerClose}></AppDrawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {renderRoutes()}
      </main>
    </ThemeProvider>
  );
}

const mapStateToProps = (state, ownProps) => ({
  open: selectDrawerOpen(state)
})


export default connect(mapStateToProps, marketingActions)(App)